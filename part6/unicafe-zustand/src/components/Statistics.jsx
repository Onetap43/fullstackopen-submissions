import StatisticLine from './StatisticLine'

const Statistics = ({
  good,
  neutral,
  bad
}) => {
  const total = good + neutral + bad

  if (total === 0) {
    return (
      <p>No feedback given</p>
    )
  }

  const average =
    (good - bad) / total

  const positive =
    (good / total) * 100

  return (
    <table>
      <tbody>
        <StatisticLine
          text="good"
          value={good}
        />

        <StatisticLine
          text="neutral"
          value={neutral}
        />

        <StatisticLine
          text="bad"
          value={bad}
        />

        <StatisticLine
          text="all"
          value={total}
        />

        <StatisticLine
          text="average"
          value={average}
        />

        <StatisticLine
          text="positive"
          value={`${positive} %`}
        />
      </tbody>
    </table>
  )
}

export default Statistics