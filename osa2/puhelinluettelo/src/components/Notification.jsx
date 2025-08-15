const Notification = ({ message, isError }) => {
    const notificationStyle = {
      color: 'green',
      background: 'lightgrey',
      fontSize: '20px',
      borderStyle: 'solid',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px',
    }
    const errorStyle = {
      ...notificationStyle,
      color: 'red',
    }
  if (!message) {
    return null
  }

  return ( 
    <div style={isError ? errorStyle : notificationStyle}>
    {message}
    </div>
  )
}

export default Notification