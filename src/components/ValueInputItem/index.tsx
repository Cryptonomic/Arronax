import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AttributeDefinition, AttrbuteDataType } from 'conseiljs';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import DatePicker from 'react-datepicker';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { debounce } from "throttle-debounce";
import "react-datepicker/dist/react-datepicker.css";

import { getHightCardinalityValues } from '../../reducers/app/thunks';
import { CARDINALITY_NUMBER } from '../../utils/defaultQueries';

const Container = styled.div<{isLong: boolean}>`
  width: ${({ isLong }) => (isLong ? '350px' : '200px')};
  height: 52px;
  display: flex;
  align-items: center;
  flex: 1;
`;

const DatePickerWrapper = styled(DatePicker)`
  border-radius: 0 5px 5px 0;
  border: none;
  color: #4A4A4A;
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  height: 52px;
  letter-spacing: 0;
  line-height: 17px;
  outline: none;
  padding-left: 10px;
  width: 250px;
  ::placeholder {
    color: #4A4A4A;
  }
`;

const styles: any = {
  root: {
    height: 250,
    flexGrow: 1,
  },
  container: {
    position: 'relative',
    minWidth: '100%'
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    maxHeight: 200,
    overflow: 'auto',
    paddingBottom: 3,
    borderRadius: 3,
    width: 'fit-content',
    minWidth: '100%'
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  input: {
    color: '#4A4A4A',
    fontSize: '18px',
    width: '100%',
    letterSpacing: 0,
    lineHeight: '17px',
    height: '52px',
    paddingLeft: '10px',
    flex: 1
  },
};

interface OwnProps {
  attribute: AttributeDefinition;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  fetchValues: (attribute: string, value: string) => any;
  classes: any;
}

type Props = OwnProps & WithTranslation;

interface States {
  prevValue: string;
  stateVal: string;
  suggestions: any[];
  searchedVal: string;
  availableValues: string[];
}

class InputItem extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      prevValue: '',
      stateVal: '',
      suggestions: [],
      searchedVal: '',
      availableValues: []
    };
    this.autocompleteSearchDebounce = debounce(300, this.autocompleteSearch);
    this.inputValueChange = debounce(300, (value: string) => this.props.onChange(value));
  }

  autocompleteSearchDebounce: Function;
  inputValueChange: Function;

  static defaultProps: any = {
    disabled: false
  };
  
  static getDerivedStateFromProps(props: Props, state: States) {
    if (props.value !== state.prevValue) {
      return {
        stateVal: props.value,
        prevValue: props.value
      };
    }
    return null;
  }

  autocompleteSearch = (attribute: string, value: string) => {
    const { fetchValues } = this.props;
    fetchValues(attribute, value).then((values: any) => {
      this.setState({availableValues: values, suggestions: values, searchedVal: value});
    });
  }

  onHighCardValueChange = async (event: any, { newValue }: any) => {
    const { value, onChange, attribute } = this.props;
    const { searchedVal } = this.state;
    const splitVals = newValue.split(',');
    const filterVal = splitVals[splitVals.length - 1].trim();
    const filterValLength = filterVal.length;
    if(filterValLength === 0) {
      this.setState({availableValues: [], suggestions: [], searchedVal: ''});
    } else if (filterValLength > 2 && (!searchedVal || searchedVal.length > filterValLength)) {
      this.autocompleteSearchDebounce(attribute.name, filterVal);
    }

    if (value.length > newValue.length && filterValLength === 0) {
      this.setState({stateVal: newValue});
    } else {
      onChange(newValue);
    }
  }

  onValueChange = (event: any) => {
    const newValue = event.target.value;
    const { value } = this.props;
    const lastChar = newValue.slice(-1);
    if (value.length > newValue.length && lastChar === ',') {
      this.setState({stateVal: newValue});
    } else {
      this.setState({stateVal: newValue});
      this.inputValueChange(newValue);
    }
  }

  renderInputComponent = (inputProps: any) => {
    const { classes, inputRef = () => {}, ref, ...other } = inputProps;
    return (
      <InputBase
        className={classes.input}
        inputRef= {node => {
          ref(node);
          inputRef(node);
        }}
        {...other}
      />
    );
  }
  
  renderSuggestion = (suggestion: any, { query, isHighlighted }: any) => {
    const matches = match(suggestion, query);
    const parts = parse(suggestion, matches);
  
    return (
      <MenuItem selected={isHighlighted} component="div">
        <div>
          {parts.map(part => (
            <span key={part.text} style={{ fontWeight: part.highlight ? 500 : 400 }}>
              {part.text}
            </span>
          ))}
        </div>
      </MenuItem>
    );
  }

  getSuggestions = (value: any) => {
    const { availableValues } = this.state;
    const splitVals = value.split(',');
    const inputValue = splitVals[splitVals.length - 1].trim().toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength === 0
      ? []
      : availableValues.filter(val => val.slice(0, inputLength).toLowerCase() === inputValue);
  }
  
  getSuggestionValue = (suggestion: any) => {
    return suggestion;
  }

  handleSuggestionsFetchRequested = ({ value }: any) => {
    const suggestions = this.getSuggestions(value);
    this.setState({suggestions});
  };

  handleSuggestionsClearRequested = () => {
    this.setState({suggestions: []});
  };


  render () {
    const {
      t,
      attribute,
      value,
      disabled,
      onChange,
      classes
    } = this.props;
    const { stateVal, suggestions } = this.state;

    const isLong = attribute.dataType === AttrbuteDataType.STRING || attribute.dataType === AttrbuteDataType.HASH || attribute.dataType === AttrbuteDataType.ACCOUNT_ADDRESS;
    
    if (attribute.dataType === AttrbuteDataType.DATETIME) {
      const newValue: any = value? new Date(Number(value)) : '';
      return (
        <DatePickerWrapper
          selected={newValue}
          placeholderText={t('components.valueInputItem.select_date')}
          showTimeSelect
          timeFormat='HH:mm'
          timeIntervals={15}
          dateFormat='MMMM d, yyyy h:mm aa'
          timeCaption='time'
          onChange={(val: any) => onChange(String(new Date(val).getTime()))}
        />
      )
    }
    if (attribute.cardinality && attribute.cardinality >= CARDINALITY_NUMBER && attribute.cacheConfig && attribute.cacheConfig.cached) {
      const autosuggestProps = {
        renderInputComponent: this.renderInputComponent,
        suggestions,
        onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
        onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
        getSuggestionValue: this.getSuggestionValue,
        renderSuggestion: this.renderSuggestion,
      };
      return (
        <Container isLong={isLong}>
          <Autosuggest
            {...autosuggestProps}
            inputProps={{
              id: 'high-cardinality-input',
              placeholder: attribute.placeholder ? attribute.placeholder : t('components.valueInputItem.insert_value'),
              value: stateVal,
              onChange: this.onHighCardValueChange,
              disabled
            }}
            theme={{
              container: classes.container,
              suggestionsContainerOpen: classes.suggestionsContainerOpen,
              suggestionsList: classes.suggestionsList,
              suggestion: classes.suggestion,
            }}
            renderSuggestionsContainer={options => (
              <Paper {...options.containerProps} square>
                {options.children}
              </Paper>
            )}
          />
        </Container>
      )
    }

    return (
      <InputBase
        className={classes.input}
        value={stateVal}
        placeholder={attribute.placeholder ? attribute.placeholder : t('components.valueInputItem.insert_value')}
        onChange={this.onValueChange}
      />
    )
    
  }
}

const mapStateToProps = (state: any) => ({

});

const mapDispatchToProps = (dispatch: any) => ({
  fetchValues: (attribute: string, value: string) => dispatch(getHightCardinalityValues(attribute, value)),
});

export const ValueInputItem: any = compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(withTranslation()(InputItem));
