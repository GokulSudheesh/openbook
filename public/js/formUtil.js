function show(button) {
  button.classList.toggle("fa-eye-slash")
  button.classList.toggle("fa-eye")
  const pwField = button.previousElementSibling
  if (pwField.type === "text") {
    pwField.type = "password"
  } else {
    pwField.type = "text"
  }
}
