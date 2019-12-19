import { Button, Container, Paper, TextField, Typography } from '@material-ui/core';
import Router from 'next/router';
import React from 'react';
import defaultPage from '../hocs/defaultPage';
import { strapiRegister } from '../lib/auth';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        email: '',
        username: '',
        password: '',
      },
      loading: false,
      error: '',
    };
  }
  componentDidMount() {
    if (this.props.isAuthenticated) {
      Router.push('/'); // redirect if you're already logged in
    }
  }

  onChange(propertyName, event) {
    const { data } = this.state;
    data[propertyName] = event.target.value;
    this.setState({ data });
  }
  onSubmit() {
    const {
      data: { email, username, password },
    } = this.state;
    this.setState({ loading: true });

    strapiRegister(username, email, password)
      .then(() => this.setState({ loading: false }))
      .catch((error) => this.setState({ error: error }));
  }

  render() {
    const { error, loading } = this.state;
    return (
      <Container maxWidth='sm'>
        <Paper>
          <Typography variant='body1'>{error}</Typography>
          {loading && <Typography variant='body1'>Loading...</Typography>}
          <form>
            <div>
              <TextField
                id='username'
                label='Nome de utilizador'
                value={this.state.username}
                onChange={this.onChange.bind(this, 'username')}
                type='text'
                variant='outlined'
              />
            </div>
            <div>
              <TextField
                id='email'
                label='Email'
                value={this.state.email}
                onChange={this.onChange.bind(this, 'email')}
                type='email'
                variant='outlined'
              />
            </div>
            <div>
              <TextField
                id='password'
                label='Palavra Passe'
                value={this.state.password}
                onChange={this.onChange.bind(this, 'password')}
                type='password'
                variant='outlined'
              />
            </div>
            <Button color='primary' onClick={this.onSubmit.bind(this)}>
              Registar
            </Button>
          </form>
        </Paper>
      </Container>
    );
  }
}
export default defaultPage(SignUp);
