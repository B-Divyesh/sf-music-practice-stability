# Demo sandbox

- URL: `https://music-practice-stability.sociobot.in/?demo=1`
- Local URL: `http://127.0.0.1:4173/?demo=1`
- Route alias: `/demo`

The demo starts with a four-attack passage called “G major crossing.” It has
six sessions over sixteen days. Timing spread falls from 54 ms to 26 ms.
Each session has six realistic takes and controlled marks.

Demo state uses the `demo:steady-take` key in `sessionStorage`. It never reads
or writes the IndexedDB database used by real practice. “Reset demo” removes
that key and restores the bundled sample. “Start for real” removes that key
before opening real practice, so sample changes are discarded immediately.

The service worker packages the sample in JavaScript, so `/?demo=1` can reload
offline after the first connected visit. Verifiers can add a sample session,
reset it, capture six tap takes, and inspect the text version of the chart.
