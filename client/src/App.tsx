import React, { ReactElement, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import Language from "./pages/language";
import Mypage from "./pages/mypage";
import Setting from "./pages/settings";
import Navbar from "./components/navbar";
import Menubar from "./components/menubar";
import Signup from "./components/singup";
import SignIn from "./components/signin";
import CreateContent from "./components/userinfobox";
import styled from "styled-components";

axios.defaults.baseURL = "http://52.78.136.21:4000/";

function App(): ReactElement {
  const [category, setCategory] = useState("");
  function getCategory(category: string) {
    setCategory(category);
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Navbar />
          <Signup />
          <SignIn />
          <Menubar />
          <Contents>
            <Language category={category} />
            <CreateContent getCategory={getCategory} />
          </Contents>
        </Route>
      </Switch>
      <Switch>
        <Route exact path="/culture">
          <Navbar />
          <Signup />
          <SignIn />
          <Menubar />
          <Contents>
            <Language category={category} />
            <CreateContent getCategory={getCategory} />
          </Contents>
        </Route>
      </Switch>
      <Switch>
        <Route exact path="/history">
          <Navbar />
          <Signup />
          <SignIn />
          <Menubar />
          <Contents>
            <Language category={category} />
            <CreateContent getCategory={getCategory} />
          </Contents>
        </Route>
      </Switch>
      <Switch>
        <Route exact path="/travel">
          <Navbar />
          <Signup />
          <SignIn />
          <Menubar />
          <Contents>
            <Language category={category} />
            <CreateContent getCategory={getCategory} />
          </Contents>
        </Route>
      </Switch>
      <Switch>
        <Route exact path="/mypage">
          <Navbar />
          <Signup />
          <SignIn />
          <Mypage />
        </Route>
      </Switch>
      <Switch>
        <Route exact path="/settings">
          <Navbar />
          <Signup />
          <SignIn />
          <Setting />
        </Route>
      </Switch>
    </Router>
  );
}

const Contents = styled.div`
  display: flex;
  width: 75rem;
  margin: auto;
`;

export default App;
