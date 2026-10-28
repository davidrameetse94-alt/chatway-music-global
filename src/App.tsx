import { useState } from 'react'
import { Play, Music } from 'lucide-react'

declare global { interface Window { showZone?: (id:number)=>Promise<any>; monetagConfig?: any } }

export default function App(){
  const [playing, setPlaying] = useState<string|null>(null)
  
  const playWithAd = async (id:string, song:string) => {
    try{
      if(window.showZone) await window.showZone(12141366) // Interstitial before play
    }catch(e){ console.log('ad skip', e) }
    setPlaying(id)
    console.log('Now playing', song)
  }

  const unlockFullVideo = async () => {
    try{
      if(window.showZone){
        await window.showZone(12141355) // Rewarded
        alert('Full video unlocked - $1 CPA zone 302344 triggered after 2 clicks logic in Monetag')
        if(window.showZone) await window.showZone(302344) // OnClick CPA
      }
    }catch(e){ console.log(e) }
  }

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="flex items-center gap-3 mb-8"><Music className="text-emerald-400"/><h1 className="text-2xl font-extrabold">ChatWay Music Global</h1><span className="ml-auto bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs">LIVE + Monetag 6 Zones</span></header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Top Hit 1 - iTunes','Top Hit 2 - Spotify','Top Hit 3 - World'].map((s,i)=>(
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition">
            <h3 className="font-bold mb-3">{s}</h3>
            <button onClick={()=>playWithAd(String(i),s)} className="w-full bg-white text-black rounded-full py-2.5 font-bold flex items-center justify-center gap-2"><Play size={16}/> {playing===String(i)?'Playing...':'Preview Play'}</button>
            <button onClick={unlockFullVideo} className="w-full mt-2 bg-emerald-500 text-black rounded-full py-2 font-bold text-sm">Unlock Full Video (Ad)</button>
          </div>
        ))}
      </div>
      <div className="mt-8 text-xs text-slate-500">Zones: AppOpen 12141348 | Inter 12141366 | Rewarded 12141355 | Vignette 12141307 | Push 9510382 | CPA 302344 | 2 clicks = $1</div>
    </div>
  )
                                            }
