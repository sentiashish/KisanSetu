import { AlertTriangle, LoaderCircle, WifiOff } from 'lucide-react'

export function LoadingState({ text }) { return <div className="state-box"><LoaderCircle className="spin" size={30} /><p>{text}</p></div> }
export function ErrorState({ text, retry }) { return <div className="state-box error-state"><AlertTriangle size={30} /><p>{text}</p><button className="secondary-action" onClick={retry} type="button">↻ {retry.label || 'Retry'}</button></div> }
export function OfflineState({ title, text }) { return <div className="state-box"><WifiOff size={30} /><h2>{title}</h2><p>{text}</p></div> }