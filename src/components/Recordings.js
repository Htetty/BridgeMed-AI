import { useState, useEffect, useRef } from 'react'
import { vapi } from './vapi'
import { translationAssistant } from './translation.assistant'
import { Phone, PhoneOff, Loader2 } from 'lucide-react'
import BioDigitalViewer from './BioDigitalViewer'
import { createClient } from '@supabase/supabase-js'


const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
)

const VAPI_PUBLIC_KEY = process.env.REACT_APP_VAPI_PUBLIC_KEY

const CALL_STATUS = {
  INACTIVE: 'inactive',
  ACTIVE: 'active',
  LOADING: 'loading'
}

function Recordings() {
  const [callStatus, setCallStatus] = useState(CALL_STATUS.INACTIVE)
  const [messages, setMessages] = useState([])
  const [activeTranscript, setActiveTranscript] = useState(null)
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null) // ✅ NEW STATE
  const currentAppointmentIdRef = useRef(null)

  const messagesRef = useRef(messages)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeTranscript])

  const isLoading = callStatus === CALL_STATUS.LOADING
  const isActive = callStatus === CALL_STATUS.ACTIVE

  useEffect(() => {
    if (!VAPI_PUBLIC_KEY || VAPI_PUBLIC_KEY === 'your_vapi_public_key_here') {
      console.error('Missing Vapi API key')
      return
    }

    const onCallStart = async () => {
      setCallStatus(CALL_STATUS.ACTIVE)

      const sessionResult = await supabase.auth.getSession()
      const userId = sessionResult.data.session?.user?.id

      if (!userId) {
        console.error('No user ID found. Cannot insert appointment.')
        return
      }
      const { data, error } = await supabase
      .from('appointments')
      .insert([{ user_id: userId, dates: new Date().toISOString(), notes: null }])
      .select()

    if (error || !data || !data[0]) {
      console.error('❌ Failed to insert appointment:', error?.message)
    } else {
      setCurrentAppointmentId(data[0].id)
      currentAppointmentIdRef.current = data[0].id
      console.log('🆕 Inserted appointment with ID:', data[0].id)
    }
  }
  let summaryTitle = ''

    const onCallEnd = () => {
      setCallStatus(CALL_STATUS.INACTIVE)
      setActiveTranscript(null)

      const allTexts = messagesRef.current.map(msg => msg.content).join(' ')
      console.log('All user messages:', allTexts)

      fetch('http://localhost:5050/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: allTexts })
      })
        .then(res => res.json())
        .then(data => {
          const summarizedText = data.response
          console.log('Summarized response:', summarizedText)
        
          const periodIndex = summarizedText.lastIndexOf('.')
          summaryTitle = summarizedText.substring(periodIndex + 1).trim()
          const toTranslate = summarizedText.substring(0, periodIndex + 1).trim()
        
          console.log('Title for Supabase:', summaryTitle)
        

          return fetch('http://localhost:5050/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: toTranslate })
          })
        })
        .then(res => res.json())
        .then(async (data) => {
          const translatedResponse = data.response?.text || data.response || ''
          console.log('Translated response:', translatedResponse)

          const sessionResult = await supabase.auth.getSession()
          const userId = sessionResult.data.session?.user?.id

          if (!userId) {
            console.error('No user ID found. Cannot save appointment.')
            return
          }

          const appointmentId = currentAppointmentIdRef.current
        if (!appointmentId) {
          console.error('⚠️ No current appointment ID available to update.')
          return
        }
          
          const { data: updatedRows, error: updateError } = await supabase
            .from('appointments')
            .update({ notes: translatedResponse,
            title: summaryTitle
            })
            .eq('id', appointmentId)
            .select()

          if (updateError) {
            console.error('Failed to update appointment notes:', updateError.message)
          } else if (!updatedRows || updatedRows.length === 0) {
            console.warn('Update did not apply to any row.')
          } else {
            console.log('Notes updated successfully in Supabase:', updatedRows[0].notes)
          }
        })
    }

    const onMessage = (message) => {
      if (message.type === 'transcript') {
        if (message.role !== 'user') return

        if (message.transcriptType === 'partial') {
          setActiveTranscript({ role: message.role, text: message.transcript })
        } else if (message.transcriptType === 'final') {
          setActiveTranscript(null)
          addMessage(message.role, message.transcript)

          fetch('http://localhost:5050/anatomy', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: message.transcript })
          })
            .then(res => res.json())
            .then(data => {
              if (data.objectId) {
                console.log('Matched anatomy:', data)
              } else {
                console.warn('No matching anatomy')
              }
            })
            .catch(err => {
              console.error('Anatomy request failed:', err)
          })
        }
      }
    }

    vapi.on('call-start', onCallStart)
    vapi.on('call-end', onCallEnd)
    vapi.on('message', onMessage)

    return () => {
      vapi.off('call-start', onCallStart)
      vapi.off('call-end', onCallEnd)
      vapi.off('message', onMessage)
    }
  }, [])

  const addMessage = (type, content) => {
    if (type !== 'user') return
    const newMessage = {
      id: Date.now(),
      type,
      content,
      time: new Date().toLocaleTimeString()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const start = async () => {
    setCallStatus(CALL_STATUS.LOADING)
    try {
      await vapi.start(translationAssistant)
    } catch (error) {
      console.error('Failed to start call:', error)
      setCallStatus(CALL_STATUS.INACTIVE)
    }
  }

  const stop = () => {
    setCallStatus(CALL_STATUS.LOADING)
    vapi.stop()
  }

  const toggleCall = () => {
    if (isActive) stop()
    else if (!isLoading) start()
  }

  return (
    <div className="main">
      <div className="header">Recordings</div>

      <div style={{
        display: 'flex',
        gap: '20px',
        padding: '20px',
        height: 'calc(100vh - 120px)'
      }}>
        <div style={{
          flex: '1',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 font-serif">Transcription </h2>
          </div>

          {messages.length === 0 && !activeTranscript ? (
            <div className="text-center text-gray-500 mt-20 animate-fade-in">
              <br></br>
              <br></br>
              <p className="font-serif">No transcription yet.</p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div key={message.id} className="bg-blue-50 rounded-lg p-4 mb-4 border-l-4 border-blue-500 animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      Doctor:
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 mb-2 font-serif break-words leading-relaxed">
                        {message.content}
                      </p>
                      <small className="text-gray-500 text-xs font-serif">{message.time}</small>
                    </div>
                  </div>
                </div>
              ))}
              {activeTranscript && (
                <div className="bg-yellow-50 rounded-lg p-4 mb-4 border-l-4 border-yellow-500 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      Dr.
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 italic font-serif break-words leading-relaxed">
                        {activeTranscript.text}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div style={{
          flex: '0 0 300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          padding: '40px 20px'
        }}>
          <div style={{ marginBottom: '30px' }}>
            <button
              onClick={toggleCall}
              disabled={isLoading}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
                isActive
                  ? 'bg-red-500 hover:bg-red-600'
                  : isLoading
                  ? 'bg-yellow-500'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : isActive ? (
                <PhoneOff className="w-8 h-8" />
              ) : (
                <Phone className="w-8 h-8" />
              )}
            </button>
          </div>
          <div style={{ textAlign: 'center', color: '#666' }}>
            <p style={{ fontSize: '16px', marginBottom: '10px', fontFamily: 'Georgia, serif' }}>Start a call and talk to see transcripts.</p>
            <p style={{ fontSize: '14px', opacity: 0.8, fontFamily: 'Georgia, serif' }}>Use the voice translator to begin your session.</p>
          </div>
        </div>

        <div style={{
          flex: '2',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ 
            textAlign: 'center', 
            color: 'black', 
            marginLeft: '20px',
            marginTop: '-10px',
            fontSize: '18px',
            fontWeight: 'bold',
            fontFamily: 'Georgia, serif'
          }}>
            Anatomy Viewer
          </h3>
          <div className="anatomy" style={{ flex: '1', minHeight: '0' }}>
            <BioDigitalViewer />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Recordings
