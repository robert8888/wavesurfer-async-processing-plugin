### Motivation
This piece of code is a plugin for wavesurfer.js which prevent 
blocking main browser thread during analyzing audio file. 
This problem occurs during analyzing long audio files or 
high resolution analyzing eg. minPxPerSec = 400 what's 
means that each second of file produce an array of 800 
items for each channel. During analyzing 9 min audio 
this producing arrays of ~~ 432 000 elements. Computing so 
long arrays at once in browser environment blocking 
main tread for hundreds of second.

>WARNING Implement only for WebAudio backend. (default)

### Modifications
- modification - wavesurfer.drawBuffer- to using getPeeksAsync
- adding - wavesurfer.Backend.prototype.getPeeksAsync

### How it works
During analysis audio data for each channel data
of audio buffer is return promise. This promise
run setTimeout with function iterating through
whole buffer. If iterating take more that yieldIteration
(16 ms by default) then stops loop and resolve promise with value
of index to which peeks are computed. If is not
whole buffer then function is run again but starting
from point on which previous call was ended. In such
way iteration of audio buffer is split to 16 ms chunks what's
allow keeping 60 frames per second.

### Usage

```javascript
import WaveSurfer from "wavesurfer.js"
import WaveSurferAsync from "wavesurfer.js-async"


const config = {
    container: document.getElementyById("container"),
    minPxPerSec : 300, // the benefits are visible in big zooms 
    plugins: [WaveSurferAsync.create()]
}

const ws = WaveSurfer.create(config);
```

You can adjust time after witch loop will be break
and computes will be moved to next call/iteration
```javascript
plugins: [
    WaveSurferAsync.create({
        yieldIteration: 16 // optional break point time - default 16 ms
    })
]
```