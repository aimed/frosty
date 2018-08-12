import './FridgeIngredientInput.scss';

import * as React from 'react';

import { Query, QueryResult } from 'react-apollo';
import { IngredientsSearch, IngredientsSearch_allIngredients, IngredientsSearchVariables } from './__generated__/IngredientsSearch';

import gql from 'graphql-tag';
import { AddIngredientHandler } from './FridgeContent';
import { FridgeIngredientInputSelectionBox } from './FridgeIngredientInputSelectionBox';

const IngredientsSearchQuery = gql`
query IngredientsSearch($search: String) {
  allIngredients(search: $search, first: 2) {
    edges {
      node {
        id
        name
        unit
        icon
      }
    }
  }
}
`;

export interface FridgeIngredientInputProps {
  search?: string;
  onSubmit?: AddIngredientHandler;
  onSearch?: React.FormEventHandler<HTMLInputElement>,
  selectIndex?: number;
  onSelect?: (selectIndex: number) => any;
  suggestions?: IngredientsSearch_allIngredients;
}
export function FridgeIngredientInput(props: FridgeIngredientInputProps) {
  const {
    search,
    onSearch,
    onSubmit,
    suggestions = { edges: [] },
    onSelect,
    selectIndex = -1,
  } = props;

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.keyCode === 40 /* down */ && onSelect) {
      onSelect(Math.min(selectIndex + 1, suggestions.edges.length - 1))
      event.preventDefault();
    } else if (event.keyCode === 38 /* up */ && onSelect) {
      onSelect(Math.max(selectIndex - 1, -1));
      event.preventDefault();
    }
  };

  const handleClick = (index: number) => {
    if (onSubmit && index >= 0 && index < suggestions.edges.length) {
      const selected = suggestions.edges[index].node;
      onSubmit({ name: selected.name, unit: selected.unit, amount: 1 }, selected);
    }
  };

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    // TODO: Add proper weigt and units.
    if (event) {
      event.preventDefault();
    }
    if (!onSubmit) {
      return;
    }
    if (selectIndex >= 0) {
      handleClick(selectIndex);
    } else if (props.search) {
      onSubmit({ name: props.search, unit: 'g', amount: 1 });
    }
  };

  return (
    <form className="FridgeIngredientInput" onSubmit={handleSubmit}>
      <input
        value={search}
        onChange={onSearch}
        onKeyDown={onKeyDown}
      />
      <FridgeIngredientInputSelectionBox 
        selectIndex={selectIndex} 
        suggestions={suggestions.edges} 
        onClick={handleClick} 
      />
    </form>
  );
}

export interface FridgeIngredientInputWithDataProps {
  addIngredient: AddIngredientHandler;
}

export interface FridgeIngredientInputWithDataState {
  search: string;
  selectIndex: number;
}

export class FridgeIngredientInputWithData extends React.PureComponent<FridgeIngredientInputWithDataProps, FridgeIngredientInputWithDataState> {
  public state: FridgeIngredientInputWithDataState = {
    search: '',
    selectIndex: -1,
  };

  public onSearch: React.FormEventHandler<HTMLInputElement> = event => {
    this.setState({ search: event.currentTarget.value, selectIndex: -1 });
  }

  public addIngredient: AddIngredientHandler = async (variables, optimisticIngredient) => {
    const result = await this.props.addIngredient(variables, optimisticIngredient);
    if (!result || !result.data) {
      this.setState({ search: '', selectIndex: -1 });
      return;
    } else {
      this.setState({ search: '', selectIndex: -1 });
    }
  }

  public onSelect = (selectIndex: number) => {
    this.setState({ selectIndex });
  }

  public render() {
    const { search, selectIndex } = this.state;
    const variables: IngredientsSearchVariables = { search };
    return (
      <Query query={IngredientsSearchQuery} variables={variables}>
        {(result: QueryResult<IngredientsSearch>) => {
          let edges: IngredientsSearch_allIngredients | undefined;

          if (search !== '' && result && result.data) {
            edges = result.data.allIngredients;
          }

          return (
            <FridgeIngredientInput search={search} onSearch={this.onSearch} onSubmit={this.addIngredient} onSelect={this.onSelect} suggestions={edges} selectIndex={selectIndex} />
          );
        }}
      </Query>
    );
  }
}
