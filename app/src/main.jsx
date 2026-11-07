import  React  from "react"
import  ReactDOM  from "react-dom/client"
import  { Login }  from "./containers/index"
import GlobalStyles from "./styles/globalStyled"


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Login />
    <GlobalStyles />
  </React.StrictMode>,
)
