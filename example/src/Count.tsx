import React, { useState, useMemo } from "react"

function Count() {
  const [count, setCount] = useState(0)
  const result = useMemo(() => count * 2, [count])
  return <div>
    {count} <br />
    {result} <br />
    <button onClick={() => setCount(count + 1)}>+</button>
  </div>
}

export default Count