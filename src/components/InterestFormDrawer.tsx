import { ArrowRight, Check } from 'lucide-react'
import { type FormEvent, useCallback, useRef, useState } from 'react'

import { FormDrawerShell } from '@/components/FormDrawerShell'
import { submitGoogleForm } from '@/lib/googleForms'

const formId = '1FAIpQLSd32eqEqzbXNA8jgYPph2oMqCnLf1LBQ_12K75LmNto8BJxWg'
const formUrl = `https://docs.google.com/forms/d/e/${formId}/viewform`

export function InterestFormDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [question, setQuestion] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const emailRef = useRef<HTMLInputElement>(null)

  const close = useCallback(() => {
    setEmail('')
    setQuestion('')
    setStatus('idle')
    onClose()
  }, [onClose])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!emailRef.current?.checkValidity()) {
      emailRef.current?.reportValidity()
      emailRef.current?.focus()
      return
    }

    setStatus('submitting')
    try {
      await submitGoogleForm(formId, { '895010099': email.trim(), '2057883278': question.trim() })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <FormDrawerShell open={open} onClose={close} eyebrow="ATTEND · 2026" title="Join the interest list" titleId="interest-form-title">
      {status === 'success' ? (
        <div className="form-success" role="status" tabIndex={-1}>
          <Check aria-hidden />
          <h3>You’re on the list.</h3>
          <p>Your response was sent to the CLUFTCON organizers. We’ll be in touch when registration opens.</p>
          <button className="form-submit" type="button" onClick={close}>Done</button>
        </div>
      ) : (
        <>
          <p>Leave your email and we’ll let you know when formal registration opens.</p>
          <form className="custom-google-form" onSubmit={submit} noValidate>
            <label className="form-field">
              <span>Email address <i>Required</i></span>
              <input ref={emailRef} type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
            </label>
            <label className="form-field">
              <span>Questions or requests <i>Optional</i></span>
              <textarea rows={5} maxLength={500} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Anything you’d like the organizers to know?" />
              <small>{question.length} / 500</small>
            </label>
            {status === 'error' && <p className="form-error" role="alert">We couldn’t send this response. Please use the Google Form link below.</p>}
            <button className="form-submit" type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Sending…' : <>Join the list <ArrowRight /></>}</button>
          </form>
          <p className="form-provider-note">Responses are stored in Google Forms. <a href={formUrl} target="_blank" rel="noreferrer">Open the original form</a>.</p>
        </>
      )}
    </FormDrawerShell>
  )
}
