import { Button, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';

const PasswordChange = () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  return (
    <div>
      <Typography variant='h5' component='h2'>
        Alterar palavra-passe
      </Typography>
      <div>
        <TextField label='Palavra-passe atual' value={password} onChange={setPassword} />
      </div>
      <div>
        <TextField label='Nova palavra-passe' value={newPassword} onChange={setNewPassword} />
      </div>
      <div>
        <TextField
          label='Confirmar palavra-passe'
          value={passwordConfirmation}
          onChange={setPasswordConfirmation}
        />
      </div>
      <Button variant='contained' color='primary'>
        Alterar
      </Button>
    </div>
  );
};

export default PasswordChange;
