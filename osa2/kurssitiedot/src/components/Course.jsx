const Course = ({ course }) => {
  console.log(course)
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
  
}

const Header = (props) => {
  console.log(props)
  return (
  <div>
    <h1>{props.course}</h1>
  </div>
  
  )
}

const Content = ({parts}) => {
  console.log(parts)
  return (
  <div>
    {parts.map(part =>
      <Part key={part.id} part={part.name} exercises={part.exercises} />
    )}
  </div>
  )
}

const Part = (props) => {
  console.log(props)
  return (
    <div>
      <p>{props.part} {props.exercises}</p>
    </div>
  )
}

const Total = (props) => {
  console.log(props)
  const total = props.parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <div>
      <p><b>total of {total} exercises</b></p>
    </div>
  )
}

export default Course