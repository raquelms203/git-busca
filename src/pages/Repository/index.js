import React, { Component } from "react";
import api from "../../services/api";
import PropTypes from "prop-types";
import { Loading, Owner, IssuesList } from "./styles";
import Container from "../Container/index";
import { Link } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { Button, Grid, Box } from "@material-ui/core";

export default class Repository extends Component {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                repository: PropTypes.string
            })
        }).isRequired
    };
    state = {
        repository: {},
        issues: [],
        loading: true,
        options: [
            ["Todas", "all"],
            ["Ativas", "open"],
            ["Fechadas", "closed"]
        ],
        valueDropdown: "all",
        page: "1"
    };
    async componentDidMount() {
        await this.buildPage();
    }

    async buildPage() {
        const { match } = this.props;

        const repoName = decodeURIComponent(match.params.repository);

        const { valueDropdown, page } = this.state;

        const [repository, issues] = await Promise.all([
            api.get(`/repos/${repoName}`),
            api.get(
                `/repos/${repoName}/issues?state=${valueDropdown}&page=${page}`
            )
        ]);

        this.setState({
            repository: repository.data,
            issues: issues.data,
            loading: false
        });
    }

    handleChange = e => {
        this.setState({
            valueDropdown: e.target.value
        });
        this.buildPage();
    };

    handleClickNext = e => {
        const sum = parseInt(this.state.page) + 1;
        this.setState({
            page: sum
        });
        this.buildPage();
    };

    handleClickPrev = e => {
        const sum = parseInt(this.state.page) - 1;
        this.setState({
            page: sum
        });
        this.buildPage();
    };

    render() {
        const {
            repository,
            issues,
            loading,
            options,
            valueDropdown,
            page
        } = this.state;

        if (loading) {
            return <Loading>Carregando...</Loading>;
        }

        return (
            <Container>
                <Owner>
                    <Link to="/">Voltar aos repositórios</Link>
                    <img
                        src={repository.owner.avatar_url}
                        alt={repository.owner.login}
                    />
                    <h1>{repository.name}</h1>
                    <p>{repository.description}</p>
                </Owner>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">
                        Filtro
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={valueDropdown}
                        onChange={this.handleChange}
                    >
                        {options.map(item => (
                            <MenuItem key={item} value={item[1]}>
                                {item[0]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <IssuesList>
                    {issues.map(issue => (
                        <li key={String(issue.id)}>
                            <img
                                src={issue.user.avatar_url}
                                alt="issue.user.login"
                            />
                            <div>
                                <strong>
                                    <a href={issue.html_url}>{issue.title}</a>
                                    {issue.labels.map(label => (
                                        <span key={String(label.id)}>
                                            {label.name}
                                        </span>
                                    ))}
                                </strong>
                                <p>{issue.user.login}</p>
                            </div>
                        </li>
                    ))}
                </IssuesList>
               <Box mt={4}>
               <Grid container direction="row" justify="space-between">
               {page > 1 && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleClickPrev}
                    >
                        {"< "} {page - 1}{" "}
                    </Button>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleClickNext}
                >
                    > {parseInt(page)+ 1}
                </Button>
               </Grid>
               </Box>
            </Container>
        );
    }
}
