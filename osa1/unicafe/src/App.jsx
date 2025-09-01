import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>

)

const StatisticLine = ({text, value}) => (
        <tr>
          <td>{text}</td>
          <td>{value}</td>
        </tr>
)

const Statistics = (props) => {
  const { good, neutral, bad } = props
  const feedbackCount = good + neutral + bad
  const feedbackAverage = (good * 1 + neutral * 0 + bad * -1) / feedbackCount
  const feedbackPositive = good / feedbackCount * 100

  if (feedbackCount === 0) return ("No feedback given")

  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={feedbackCount} />
          <StatisticLine text="average" value={feedbackAverage} />
          <StatisticLine text="positive" value={feedbackPositive + ' %'} />
        </tbody>
      </table>
    </div>
  )

}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App