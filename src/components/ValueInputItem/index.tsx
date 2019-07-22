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
`;

const DatePickerWrapper = styled(DatePicker)`
  color: #4A4A4A;
  font-size: 16px;
  letter-spacing: 0;
  line-height: 17px;
  width: 220px;
  height: 52px;
  padding-left: 10px;
  border: none;
  outline: none;
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
    color: '#9b9b9b',
    fontSize: '16px',
    letterSpacing: 0,
    lineHeight: '17px',
    width: '100%',
    height: '52px',
    paddingLeft: '10px'
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
  }

  autocompleteSearchDebounce: any;

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
    fetchValues(attribute, value).then(values => {
      this.setState({availableValues: values, suggestions: values, searchedVal: value});
    });
  }

  onHighCardValueChange = async (event, { newValue }) => {
    const { value, onChange, fetchValues, attribute } = this.props;
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

  onValueChange = (event) => {
    const newValue = event.target.value;
    const { value, onChange } = this.props;
    const lastChar = newValue.slice(-1);
    if (value.length > newValue.length && lastChar === ',') {
      this.setState({stateVal: newValue});
    } else {
      onChange(newValue);
    }
  }

  renderInputComponent = (inputProps) => {
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
  
  renderSuggestion = (suggestion, { query, isHighlighted }) => {
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

  getSuggestions = (value) => {
    const { availableValues } = this.state;
    const splitVals = value.split(',');
    const inputValue = splitVals[splitVals.length - 1].trim().toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength === 0
      ? []
      : availableValues.filter(val => val.slice(0, inputLength).toLowerCase() === inputValue);
  }
  
  getSuggestionValue = (suggestion) => {
    return suggestion;
  }

  handleSuggestionsFetchRequested = ({ value }) => {
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
      const newValue = value? new Date(Number(value)) : '';
      return (
        <DatePickerWrapper
          selected={newValue}
          placeholderText={t('components.valueInputItem.select_date')}
          showTimeSelect
          timeFormat='HH:mm'
          timeIntervals={15}
          dateFormat='MMMM d, yyyy h:mm aa'
          timeCaption='time'
          onChange={(val) => onChange(String(new Date(val).getTime()))}
        />
      )
    }
    if (attribute.cardinality && attribute.cardinality >= CARDINALITY_NUMBER) {
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
              classes,
              id: 'high-cardinality-input',
              placeholder: t('components.valueInputItem.insert_value'),
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

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(withTranslation()(InputItem));
