import styled from 'styled-components';

const Wrapper = styled.div`
  border-radius: 0.2rem;
  background-color: #ffffff;
  box-shadow: 0 0.2rem 0.4rem 0 #e3e9f3;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4.1rem 1rem 0 2.8rem;
`;

const Title = styled.div`
  flex: 2;
  width: 20%;
  color: #333740;
  font-family: Lato;
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 2.2rem;
  align-items: flex-start;
`;

const ListWrapper = styled.div`
  ul {
    margin-top: 1.5rem;
    padding: 0;
    list-style: none;
    li:last-child {
      border-bottom: none;
    }
    &.padded-list {
      padding-top: 3px !important;
    }
  }
  &.loading-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    min-height: 162px;
    padding-top: 20px;
    &.role-container {
      min-height: 142px !important;
      padding-top: 0;
    }
  }
`;

const ListEmpty = styled.li`
  width: 100%;
  height: 108px;
  background: #ffffff;

  div {
    height: 106px;
    line-height: 90px;
    font-size: 1.3rem;
    font-weight: 400;
    color: #333740;
    text-align: center;
    border-collapse: collapse;
    border-top: 1px solid #f1f1f2 !important;
  }
`;

const ListRow = styled.li`
  padding: 10px 15px;
  background: #ffffff;
  font-size: 1.3rem;
  line-height: 1.8rem;
  font-weight: 400;
  color: #333740;
  vertical-align: middle;
  border-collapse: collapse;
  border-top: 1px solid #f1f1f2 !important;

  &:hover {
    cursor: pointer;
    background: #f7f8f8;
  }
`;

const RowTop = styled.div`
  height: 1.8rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Truncate = styled.div``;

const Truncated = styled.p`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
`;

const StatusBadge = styled.span`
  margin-left: 10px;
  background-color: ${(props) => props.color};
  color: #ffffff;
  border-radius: 6px;
  padding: 3px 6px;
`;

const Hashtag = styled.span`
  color: #aaaaaa;
`;

const OrderItems = styled.div`
  color: #777777;
`;

export {
  Flex,
  ListEmpty,
  ListRow,
  ListWrapper,
  Hashtag,
  OrderItems,
  RowTop,
  StatusBadge,
  Title,
  Truncate,
  Truncated,
  Wrapper,
};
