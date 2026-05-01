import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'; 

function Chrome() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
    <div className="w-48 h-48 md:w-64 md:h-64 opacity-80">
      <DotLottieReact
        src="https://lottie.host/331af30b-c98e-42a4-9b77-c490cf9eef31/CAbj95X0Wd.lottie"
        loop
        autoplay
      />
    </div>
    <div className="mt-4 animate-pulse">
       <p className="text-green-500 font-mono text-sm tracking-[0.2em] uppercase">
         Chrome Unavailable
      </p>
      <p className="text-gray-500 font-mono text-[10px] mt-2 italic">
        Module currently under development
      </p>
    </div>
  </div>
  )
}

export default Chrome