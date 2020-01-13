import React from 'react';
import securePage from '../../hocs/securePage';

const Profile = () => <div>Only logged in users should see this.</div>;

export default securePage(Profile);
