import { ArrowLeft, ArrowRight, Check, Sprout } from 'lucide-react'
import { type FormEvent, useCallback, useRef, useState } from 'react'

import { FormDrawerShell } from '@/components/FormDrawerShell'
import { submitGoogleForm } from '@/lib/googleForms'

const formId = '1FAIpQLSd9G0YPlc7mt_BEJs5_0IXaaFGbqA5l_FmCYlqtce-qxiIecA'
const formUrl = `https://docs.google.com/forms/d/e/${formId}/viewform?usp=header`
const availabilityOptions = ['9am-12pm (Preparation)', '12pm-3pm (Event)', '3pm-5pm (Cleanup)'] as const
const shirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const

type VolunteerData = {
  name: string
  email: string
  phone: string
  availability: string[]
  shirtSize: string
  dietaryRestrictions: string
}

const emptyForm: VolunteerData = { name: '', email: '', phone: '', availability: [], shirtSize: '', dietaryRestrictions: '' }

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits.length === 10 ? `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}` : value.trim()
}

export function VolunteerFormDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [data, setData] = useState<VolunteerData>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof VolunteerData, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  const close = useCallback(() => {
    setStep(1)
    setData(emptyForm)
    setErrors({})
    setStatus('idle')
    onClose()
  }, [onClose])

  const update = <Key extends keyof VolunteerData>(key: Key, value: VolunteerData[Key]) => {
    setData((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const focusFirstError = () => requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())

  const validateContact = () => {
    const nextErrors: typeof errors = {}
    if (!data.name.trim()) nextErrors.name = 'Enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) nextErrors.email = 'Enter a valid email address.'
    if (data.phone && data.phone.replace(/\D/g, '').length !== 10) nextErrors.phone = 'Enter a 10-digit phone number.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) focusFirstError()
    return Object.keys(nextErrors).length === 0
  }

  const nextStep = () => {
    if (!validateContact()) return
    setData((current) => ({ ...current, phone: normalizePhone(current.phone) }))
    setStep(2)
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('input')?.focus())
  }

  const toggleAvailability = (value: string) => {
    const availability = data.availability.includes(value)
      ? data.availability.filter((item) => item !== value)
      : [...data.availability, value]
    update('availability', availability)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!data.availability.length) {
      setErrors({ availability: 'Choose at least one available timespan.' })
      focusFirstError()
      return
    }

    setStatus('submitting')
    try {
      await submitGoogleForm(formId, {
        '1830858523': data.name.trim(),
        '400276120': data.email.trim(),
        '349122403': normalizePhone(data.phone),
        '1781894460': data.availability,
        '232146270': data.shirtSize,
        '1523294903': data.dietaryRestrictions.trim(),
      }, '0,1')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <FormDrawerShell open={open} onClose={close} eyebrow="VOLUNTEER · 2026" title="Help the day bloom" titleId="volunteer-form-title">
      {status === 'success' ? (
        <div className="form-success" role="status" tabIndex={-1}>
          <Check aria-hidden />
          <h3>Thank you for volunteering.</h3>
          <p>Your response was sent to the CLUFTCON organizers. They’ll follow up with details as the conference approaches.</p>
          <button className="form-submit" type="button" onClick={close}>Done</button>
        </div>
      ) : (
        <>
          <p>Join the team welcoming guests, supporting speakers, and keeping the conference running smoothly.</p>
          <div className="form-progress" aria-label={`Step ${step} of 2`}>
            <span className={step === 1 ? 'is-current' : 'is-complete'}><i>01</i> Contact</span>
            <b aria-hidden />
            <span className={step === 2 ? 'is-current' : ''}><i>02</i> Availability</span>
          </div>
          <form ref={formRef} className="custom-google-form" onSubmit={submit} noValidate>
            {step === 1 ? (
              <fieldset className="form-step">
                <legend className="sr-only">Contact information</legend>
                <label className="form-field">
                  <span>Full name <i>Required</i></span>
                  <input type="text" autoComplete="name" value={data.name} onChange={(event) => update('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'volunteer-name-error' : undefined} />
                  {errors.name && <small className="field-error" id="volunteer-name-error">{errors.name}</small>}
                </label>
                <label className="form-field">
                  <span>Email address <i>Required</i></span>
                  <input type="email" autoComplete="email" value={data.email} onChange={(event) => update('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'volunteer-email-error' : undefined} />
                  {errors.email && <small className="field-error" id="volunteer-email-error">{errors.email}</small>}
                </label>
                <label className="form-field">
                  <span>Phone number <i>Optional</i></span>
                  <input type="tel" inputMode="tel" autoComplete="tel" value={data.phone} onChange={(event) => update('phone', event.target.value)} onBlur={() => update('phone', normalizePhone(data.phone))} placeholder="416-555-0123" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'volunteer-phone-error' : 'volunteer-phone-hint'} />
                  {errors.phone ? <small className="field-error" id="volunteer-phone-error">{errors.phone}</small> : <small id="volunteer-phone-hint">Canadian or US 10-digit number</small>}
                </label>
                <button className="form-submit" type="button" onClick={nextStep}>Continue <ArrowRight /></button>
              </fieldset>
            ) : (
              <fieldset className="form-step">
                <legend className="sr-only">Availability and logistics</legend>
                <div className="form-field form-choice-group">
                  <span>What times are you available? <i>Required</i></span>
                  <div className="form-choices" role="group" aria-describedby={errors.availability ? 'volunteer-availability-error' : undefined}>
                    {availabilityOptions.map((option, index) => (
                      <label key={option}><input type="checkbox" checked={data.availability.includes(option)} onChange={() => toggleAvailability(option)} aria-invalid={Boolean(errors.availability) && index === 0} /><span>{option}</span></label>
                    ))}
                  </div>
                  {errors.availability && <small className="field-error" id="volunteer-availability-error">{errors.availability}</small>}
                </div>
                <div className="form-field form-choice-group">
                  <span>T-shirt size <i>Optional</i></span>
                  <div className="size-choices" role="radiogroup" aria-label="T-shirt size">
                    {shirtSizes.map((size) => <label key={size}><input type="radio" name="shirt-size" checked={data.shirtSize === size} onChange={() => update('shirtSize', size)} /><span>{size}</span></label>)}
                  </div>
                </div>
                <label className="form-field">
                  <span>Dietary restrictions <i>Optional</i></span>
                  <textarea rows={3} value={data.dietaryRestrictions} onChange={(event) => update('dietaryRestrictions', event.target.value)} placeholder="Tell us what the lunch team should know." />
                </label>
                {status === 'error' && <p className="form-error" role="alert">We couldn’t send this response. Please use the Google Form link below.</p>}
                <div className="form-actions">
                  <button className="form-back" type="button" onClick={() => setStep(1)}><ArrowLeft /> Back</button>
                  <button className="form-submit" type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Sending…' : <>Volunteer <Sprout /></>}</button>
                </div>
              </fieldset>
            )}
          </form>
          <p className="form-provider-note">Responses are stored in Google Forms. <a href={formUrl} target="_blank" rel="noreferrer">Open the original form</a>.</p>
        </>
      )}
    </FormDrawerShell>
  )
}
