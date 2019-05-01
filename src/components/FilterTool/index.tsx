import * as React from 'react';
import styled from 'styled-components';
import ArronaxIcon from 'components/ArronaxIcon';

const Container = styled.div`
  position: relative;
  width: 107px;
  height: 52px;
  border: 1px solid #56c2d9;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #56c2d9;
  cursor: pointer;
`;

const FilterIconWrapper = styled(ArronaxIcon)`
  display: inline-block;
  margin-right: 11px;
`;

const FilterMark = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  background: #56c2d9;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 1);
  border-radius: 12px;
  color: #ffffff;
  font-size: 13px;
  letter-spacing: 0.2px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  right: -9px;
  top: -9px;
`;

interface Props {
  value: number;
  onCollapse: () => void;
}

const FilterTool: React.StatelessComponent<Props> = props => {
  const { value, onCollapse } = props;
  return (
    <Container onClick={onCollapse}>
      <FilterIconWrapper size="22px" color="#56C2D9" iconName="icon-filter" />
      Filter
      {value > 0 && <FilterMark>{value}</FilterMark>}
    </Container>
  );
};

FilterTool.defaultProps = {
  value: 0,
};

export default FilterTool;
