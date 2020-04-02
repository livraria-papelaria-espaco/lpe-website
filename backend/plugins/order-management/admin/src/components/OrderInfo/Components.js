import styled from 'styled-components';

export const LoadingWrapper = styled.div`
  height: 80vh;
  display: flex;
  align-items: center;
`;

export const Wrapper = styled.div`
  border-radius: 0.2rem;
  background-color: #ffffff;
  box-shadow: 0 0.2rem 0.4rem 0 #e3e9f3;
  padding: 15px;
`;

export const Field = styled.div`
  padding: 10px 15px;
`;

export const FieldTitle = styled.p`
  color: #888;
  margin-bottom: 0.2rem;
`;

export const FieldValue = styled.p`
  color: #000;
`;

export const ItemsField = styled(Field)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
