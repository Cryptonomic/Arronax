import * as React from 'react';
import * as moment from 'moment';
import styled from 'styled-components';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import MinusIcon from '@material-ui/icons/RemoveCircleOutline';
import CloseIcon from '@material-ui/icons/CloseRounded';
import CheckIcon from '@material-ui/icons/CheckOutlined';


import getColumns from '../../utils/getColumns';
import getDetailsColumns from '../../utils/getDetailsColumns';

const StyledCell = styled(TableCell)`
  &&& {
    padding: 0;
  }
`;
const CollapseWrapper = styled.div`
  &&& {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 16px 10px 5%;
  }
`;
const DetailItemWrapper = styled.div`
  width: 50%;
  display: flex;
  padding: 5px 10px;
  box-sizing: border-box;
`;
const ItemTitle = styled.div`
  width: 170px;
  font-size: 14px;
  font-weight: bold;
`;

const ItemContent = styled.div`
  flex: 1;
  font-size: 14px;
`;

const DetailItem = (props) => {
  const {title, content, isIcon} = props;
  let RealContent;
  if (!isIcon) {
    RealContent = (<ItemContent>{content}</ItemContent>);
  } else if (content) {
    RealContent = (<CheckIcon />);
  } else {
    RealContent = (<CloseIcon />);
  }
  return (
    <DetailItemWrapper>
      <ItemTitle>{title}:</ItemTitle>
      {RealContent}
    </DetailItemWrapper>
  );
}
  


interface Props {
  category: string;
  item: any;
}

interface State {
  isExpand: boolean;
}

class CustomTableRow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isExpand: false
    };
  }

  onExpandRow = () => {
    const {isExpand} = this.state;
    this.setState({isExpand: !isExpand});
  }

  render() {
    const {category, item} = this.props;
    const {isExpand} = this.state;
    const columns = getColumns(category);
    const detailColums =  getDetailsColumns(category);
    return (
      <React.Fragment>
        <TableRow hover={true}>
          <StyledCell padding='checkbox'>
            <IconButton aria-label="Item List" onClick={this.onExpandRow}>
              {isExpand? <MinusIcon /> : <AddIcon />}
            </IconButton>
          </StyledCell>
          {columns.map(column => {
            return (
              <StyledCell key={column.key}>
                {column.dataIndex==='timestamp' ? moment(item[column.dataIndex]).format('dd MM YYYY h:mm:ss a') : item[column.dataIndex]}
              </StyledCell>)
          })}
        </TableRow>
        {isExpand && 
          <TableRow>
            <TableCell padding='none' colSpan={12}>
              <CollapseWrapper>
                {detailColums.map((column, index) => (
                  <DetailItem
                    key={index}
                    title={column.title}
                    isIcon={column.isIcon}
                    content={item[column.dataIndex]}
                  />
                ))}
              </CollapseWrapper>
            </TableCell>
          </TableRow>
        }
      </React.Fragment>
    );
  }
}

export default CustomTableRow;