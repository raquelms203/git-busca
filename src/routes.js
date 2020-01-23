import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Repository from "./pages/Repository";
import Main from "./pages/Main";

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/repository/:repository" exact component={Repository}></Route>
                <Route path="/" component={Main}></Route>
            </Switch>
        </BrowserRouter>
    );
}
