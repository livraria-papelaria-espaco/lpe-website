import { Button, Container, Paper, TextField, Typography } from '@material-ui/core';
import Cookies from 'js-cookie';
import Router from 'next/router';
import React from 'react';
import defaultPage from '../hocs/defaultPage';
import { strapiLogin } from '../lib/auth';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        email: '',
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
      data: { email, password },
    } = this.state;

    this.setState({ loading: true });

    strapiLogin(email, password)
      .then(() => console.log(Cookies.get('user')))
      .catch((err) => this.setState({ error: err, loading: false }));
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
              Iniciar Sessão
            </Button>
          </form>
        </Paper>
      </Container>
    );
  }
}
export default defaultPage(SignIn);
