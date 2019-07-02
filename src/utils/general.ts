
import { AttributeDefinition, AttrbuteDataType } from 'conseiljs';

export const convertValue = (value) => {
  if (value === true) {
    return 'True';
  }
  if (value === false) {
    return 'False';
  }
  if (value) {
    return value.replace(/(^|_)./g, s =>
      s
        .split('_')
        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
    );
  }
  return 'Null';
};

export const truncateHash = (value) => {
  if (Number(value)) { return value; }
  if (!value || value.length < 6) { return ''; }

  const firstHalf = value.substring(0, 6);
  const secondHalf = value.slice(-6);
  return `${firstHalf}...${secondHalf}`;
}

export const formatNumber = (value: number, attribute: AttributeDefinition, isAggregated: boolean = false) => {
    if (value === undefined) { return ''; }

    let t = '';

    if (isAggregated && attribute.dataType === AttrbuteDataType.INT) {
        t = (new Intl.NumberFormat(window.navigator.languages[0], { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })).format(value);
    } else if (attribute.dataType === AttrbuteDataType.INT) {
        t = (new Intl.NumberFormat(window.navigator.languages[0], { style: 'decimal', useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 1 })).format(value);
    } else if (attribute.scale !== undefined && (attribute.dataType === AttrbuteDataType.DECIMAL || attribute.dataType === AttrbuteDataType.CURRENCY)) {
        const d = value / Math.pow(10, attribute.scale);
        let minimumFractionDigits = 0;
        let maximumFractionDigits = 0;
        if (value < 10000) {
            minimumFractionDigits = 6;
            maximumFractionDigits = 6;
        } else if (value < 100000) {
            minimumFractionDigits = 4;
            maximumFractionDigits = 4;
        } else if (value < 1000000) {
            minimumFractionDigits = 2;
            maximumFractionDigits = 2;
        }

        t = (new Intl.NumberFormat(window.navigator.languages[0], { style: 'decimal', minimumFractionDigits, maximumFractionDigits })).format(d);
    } else if (attribute.dataType === AttrbuteDataType.DECIMAL || attribute.dataType === AttrbuteDataType.CURRENCY) {
        t = (new Intl.NumberFormat(window.navigator.languages[0], { style: 'decimal', minimumFractionDigits: 6, maximumFractionDigits: 6 })).format(value);
    }

    if (attribute.dataType === AttrbuteDataType.CURRENCY) {
        if (attribute.currencySymbol !== undefined) {
            t = `${attribute.currencySymbol} ${t}`;
        } else if (attribute.currencySymbolCode !== undefined) {
            t = `${String.fromCharCode(attribute.currencySymbolCode)} ${t}`;
        }
    }

    return t;
}

export const getOperatorType = (dataType: string) => {
  if (dataType === 'Int' || dataType === 'Decimal') {
    return 'numeric';
  }
  if (dataType === 'String' || dataType === 'AccountAddress' || dataType === 'Hash') {
    return 'string';
  }
  if (dataType === 'Boolean') {
    return 'boolean';
  }
  return 'dateTime';
}

export const sortAttributes = (attributes: AttributeDefinition[]) => {
    return attributes.concat().sort((a, b) => {
    if (a.displayOrder === undefined && b.displayOrder === undefined) {
        if(a.displayName < b.displayName) { return -1; }
        if(a.displayName > b.displayName) { return 1; }
    }

    if (a.displayOrder === undefined && b.displayOrder !== undefined){
        return 1;
    }

    if (a.displayOrder !== undefined && b.displayOrder === undefined){
        return -1;
    }

    return a.displayOrder - b.displayOrder;
    });
}
