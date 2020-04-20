import { InputText, InputCheckbox } from 'strapi-helper-plugin';
import styled from 'styled-components';

export const OuterWrapper = styled.div`
  padding: 18px 30px;
`;

export const Wrapper = styled.div`
  border-radius: 0.2rem;
  background-color: #ffffff;
  box-shadow: 0 0.2rem 0.4rem 0 #e3e9f3;
  padding: 15px;
`;

export const StyledInputText = styled(InputText)`
  width: calc(13ch + 25px);
  margin-bottom: 10px;
`;

export const StlyedInputCheckbox = styled(InputCheckbox)`
  margin-bottom: 10px;
`;
