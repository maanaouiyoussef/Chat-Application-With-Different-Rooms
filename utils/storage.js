
function toLocalStorage(messageObj) {
    let messages = []
    if (!localStorage.getItem("messages")) {
      messages.push(messageObj)
      localStorage.setItem("messages", JSON.stringify(messages))
    } else {
      messages = JSON.parse(localStorage.getItem("messages"))

      messages.push(messageObj)

      localStorage.setItem("messages", JSON.stringify(messages))
    }
}

module.exports = toLocalStorage