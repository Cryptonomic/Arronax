import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 50px 0;
  min-height: calc(100vh - 405px);
`;

export const MainContainer = styled.div`
  position: relative;
  min-height: 100vh;
`;

export const TabContainer = styled.div`
  padding: 0px 15px;
  width: 100%;
`;

export const NoResultContainer = styled.div`
  width: 100%;
  padding-top: 67px;
  display: flex;
  justify-content: center;
`;

export const OctopusImg = styled.img`
  height: 183px;
  width: 169px;
`;

export const NoResultContent = styled.div`
  margin-left: 38px;
  padding-top: 16px;
`;

export const NoResultTxt = styled.div`
  color: rgb(42, 57, 115);
  font-size: 28px;
  font-weight: 500;
  line-height: 30px;
`;

export const TryTxt = styled.div`
  color: rgb(155, 155, 155);
  font-size: 18px;
  font-weight: 500;
  line-height: 21px;
  margin-top: 8px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  margin-top: 24px;
`;

export const CustomButton = styled.div`
  cursor: pointer;
  border-radius: 9px;
  height: 42px;
  width: 158px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

export const ClearButton = styled(CustomButton)`
  border: 2px solid rgb(0, 196, 220);
  color: rgb(0, 196, 220);
`;

export const TryButton = styled(CustomButton)`
  color: white;
  background: rgb(86, 194, 217);
  margin-left: 22px;
`;

export const DismissButton = styled(CustomButton)`
  color: white;
  background: rgb(86, 194, 217);
`;

export const DialogContentWrapper = withStyles({
  root: {
    minWidth: '350px'
  }
})(DialogContent);