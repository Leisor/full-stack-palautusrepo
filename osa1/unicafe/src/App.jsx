import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Display value={value} />
      <Button onClick={() => setToValue(1000)} text="good" />
      <Button onClick={() => setToValue(0)} text="neutral" />
      <Button onClick={() => setToValue(value + 1)} text="bad" />
    </div>
  )
}

export default App