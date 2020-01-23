import React, { Component } from "react";
import { Form, SubmitButton, List } from "./styles";
import { FaGithub, FaPlus, FaSpinner } from "react-icons/fa";
import api from "../../services/api";
import { Link } from "react-router-dom";
import Container from "../Container/index";

export default class Main extends Component {
    state = {
        newRepo: "",
        repositories: [],
        open: false,
        error: "0"
    };

    componentDidMount() {
        const repositories = localStorage.getItem("repositories");
        if (repositories)
            this.setState({ repositories: JSON.parse(repositories) });
    }

    componentDidUpdate(_, prevState) {
        const { repositories } = this.state;

        if (prevState.repositories !== repositories) {
            localStorage.setItem("repositories", JSON.stringify(repositories));
        }
    }

    handleInputChange = e => {
        this.setState({ newRepo: e.target.value });
    };

    handleSubmit = async e => {
        e.preventDefault();

        this.setState({ open: true, error: "0" });

        try {
            const response = await api.get(`/repos/${this.state.newRepo}`);

            const data = {
                name: response.data.full_name
            };

            this.state.repositories.forEach(repo => {
                if (repo.name === data.name)
                    throw new Error("Repositório duplicado!");
            });

            this.setState({
                repositories: [...this.state.repositories, data],
                newRepo: "",
                open: false
            });
        } catch (error) {
            this.setState({
                newRepo: "",
                open: false,
                error: "1"
            });
            return;
        }
    };

    render() {
        const { newRepo, open, repositories, error } = this.state;
        return (
            <Container>
                <h1>
                    <FaGithub />
                    Repositórios
                </h1>
                <Form onSubmit={this.handleSubmit} error={error}>
                    <input
                        type="text"
                        placeholder="Adicionar repositório"
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />
                    <SubmitButton open={open}>
                        {open ? (
                            <FaSpinner color="#FFF" size={14} />
                        ) : (
                            <FaPlus color="#FFF" size={14} />
                        )}
                    </SubmitButton>
                </Form>
                <List>
                    {repositories.map(repo => (
                        <li key={repo.name}>
                            <span>{repo.name}</span>
                            <Link
                                to={`/repository/${encodeURIComponent(
                                    repo.name
                                )}`}
                            >
                                Detalhes
                            </Link>
                        </li>
                    ))}
                </List>
            </Container>
        );
    }
}
