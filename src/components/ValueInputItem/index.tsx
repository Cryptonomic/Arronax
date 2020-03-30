import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AttributeDefinition, AttrbuteDataType, AttributeCacheConfig } from 'conseiljs';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import DatePicker from 'react-datepicker';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { debounce } from "throttle-debounce";
import DatePickerInput from './DatePickerInput';
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

const DatePickerWrapper = styled(DatePickerInput)`
  border-radius: 0 5px 5px 0;
  border: none;
  color: #4A4A4A;
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  height: 52px;
  letter-spacing: 0;
  padding: 0 18px;
  line-height: 17px;
  width: 100%;
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
  suggestionSelected: string;
}

class InputItem extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      prevValue: '',
      stateVal: '',
      suggestions: [],
      searchedVal: '',
      availableValues: [],
      suggestionSelected: ''
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
    if ((props.value !== state.prevValue)) {
      return {
          stateVal: props.value,
          prevValue: props.value
        };
      }
      return null;
  }

  autocompleteSearch = (attribute: string, value: string, valueMap?: Record<string, string>, cacheConfig?: AttributeCacheConfig) => {
    const valueMapEntries = valueMap && Object.entries(valueMap);
    
    if (valueMapEntries) {
      const matchKey: string[] | undefined = valueMapEntries.find((e: string[]) => RegExp(`^${value}`).test(e[0]));
      const matchValue: string[] | undefined = valueMapEntries.find((e: string[]) => RegExp(`^${value}`).test(e[1]));
      const matchValueMap = (matchKey || matchValue) || [];
      const matchIndex = matchValueMap && (matchKey ? 0 : 1);

      if (matchValueMap && matchValueMap.length && (matchIndex === 0 || matchIndex === 1)) {
        const searchedVal = matchValueMap[matchIndex];
        const suggestions: any[] = valueMapEntries.filter((v: any[]) => RegExp(`^${value}`).test(v[matchIndex])).map((s: string[]) => s[1]);
        this.setState({
          availableValues: suggestions,
          suggestions: suggestions,
          searchedVal
        });
        return;
      }
    }

    if (cacheConfig && cacheConfig.cached) {
      const { fetchValues } = this.props;
      fetchValues(attribute, value).then((values: string[]) => {
        this.setState({
          availableValues: values,
          suggestions: values, 
          searchedVal: value,
        });
      });
      return;
    }
  }

  onHighCardValueChange = async (event: React.FocusEvent<HTMLInputElement>, { newValue }: Autosuggest.ChangeEvent) => {
    const { attribute: { name, valueMap, cacheConfig } } = this.props;
    const { searchedVal } = this.state;
    const splitVals = newValue.toString().split(',');
    const filterVal = splitVals[splitVals.length - 1].trim();
    const filterValLength = filterVal.length;
    if(searchedVal && (filterValLength <= (cacheConfig?.minMatchLength || 4))) {
      this.setState({ availableValues: [], suggestions: [], searchedVal: '' });
    };

    if (filterValLength >= (cacheConfig?.minMatchLength || 4)) {
      this.autocompleteSearchDebounce(name, filterVal, valueMap, cacheConfig);
    }

    this.setState({stateVal: newValue})
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
    const { inputRef = () => {}, ref, ...other } = inputProps;
    const { classes } = this.props;
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
          {parts.map((part, index) => (
            <span key={index} style={{ fontWeight: part.highlight ? 500 : 400 }}>
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

  handleShouldRenderSuggestions = (value: string) => value.length >= 4 && value !== this.state.suggestionSelected;

  handleSuggestionSelected = ((e: React.FormEvent, selected: any) => {
    const { suggestionValue } = selected;
    const { suggestionSelected } = this.state;
    if (suggestionValue && suggestionSelected !== suggestionValue) {
      this.setState({
        suggestionSelected: suggestionValue
      })
    }
  })

  onBlurAutosuggest = (e: React.FocusEvent<HTMLInputElement>) => {
    const { onChange, attribute: { valueMap } } = this.props;
    let inputValue = e.target.value;

    this.setState({
      suggestionSelected: ''
    })

    const valueMapEntries = valueMap && Object.entries(valueMap);

    if (valueMapEntries) {
      inputValue = valueMapEntries.find((e: string[]) => e[1] === inputValue)?.[0] || inputValue
    }

    onChange(inputValue);
  }

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

    const valueMapEntries = attribute.valueMap && Object.entries(attribute.valueMap);
    const searchInputValue = valueMapEntries && valueMapEntries.find((e: any) => e[0] === stateVal)?.[1];
    const autosuggestValue = searchInputValue || stateVal;

    const isLong = attribute.dataType === AttrbuteDataType.STRING || attribute.dataType === AttrbuteDataType.HASH || attribute.dataType === AttrbuteDataType.ACCOUNT_ADDRESS;
    
    if (attribute.dataType === AttrbuteDataType.DATETIME) {
      const newValue: any = value? new Date(Number(value)) : '';
      return (
        <DatePicker
          selected={newValue}
          placeholderText={t('components.valueInputItem.select_date')}
          showTimeSelect
          timeFormat='HH:mm'
          timeIntervals={15}
          dateFormat='MMMM d, yyyy h:mm aa'
          timeCaption='time'
          customInput={<DatePickerWrapper />}
          onChange={(val: any) => onChange(String(new Date(val).getTime()))}
        />
      )
    }

    if (attribute.cardinality && attribute.cardinality >= CARDINALITY_NUMBER && ((attribute.cacheConfig && attribute.cacheConfig.cached) || attribute.valueMap)) {
      const autosuggestProps = {
        renderInputComponent: this.renderInputComponent,
        suggestions,
        onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
        onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
        shouldRenderSuggestions: this.handleShouldRenderSuggestions,
        getSuggestionValue: this.getSuggestionValue,
        renderSuggestion: this.renderSuggestion,
        onSuggestionSelected: this.handleSuggestionSelected
      };
      return (
        <Container isLong={isLong}>
          <Autosuggest
            {...autosuggestProps}
            inputProps={{
              id: 'high-cardinality-input',
              placeholder: attribute.placeholder ? attribute.placeholder : t('components.valueInputItem.insert_value'),
              value: autosuggestValue,
              onChange: this.onHighCardValueChange,
              onBlur: this.onBlurAutosuggest,
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
