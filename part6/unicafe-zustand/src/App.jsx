import Button from './components/Button'
import Statistics from './components/Statistics'
import useFeedbackStore from './store'

const App = () => {
  const good = useFeedbackStore((state) => state.good)
  const neutral = useFeedbackStore((state) => state.neutral)
  const bad = useFeedbackStore((state) => state.bad)

  const increaseGood = useFeedbackStore((state) => state.increaseGood)
  const increaseNeutral = useFeedbackStore((state) => state.increaseNeutral)
  const increaseBad = useFeedbackStore((state) => state.increaseBad)

  return (
    <div>
      <h1>give feedback</h1>

      <Button handleClick={increaseGood} text="good" />
      <Button handleClick={increaseNeutral} text="neutral" />
      <Button handleClick={increaseBad} text="bad" />

      <h1>statistics</h1>

      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
      />
    </div>
  )
}

export default App