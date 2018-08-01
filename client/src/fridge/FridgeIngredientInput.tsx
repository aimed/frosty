import './FridgeIngredientInput.scss';

import * as React from 'react';

import { Mutation, MutationFn, Query, QueryResult } from 'react-apollo';
import { IngredientsAdd, IngredientsAddVariables } from './__generated__/IngredientsAdd';
import { IngredientsSearch, IngredientsSearch_allIngredients, IngredientsSearchVariables } from './__generated__/IngredientsSearch';

import gql from 'graphql-tag';
import {
  FridgeContentViewer,
} from './__generated__/FridgeContentViewer';
import { FridgeContentViewerQuery } from './FridgeContent';

const IngredientsSearchQuery = gql`
query IngredientsSearch($search: String) {
  allIngredients(search: $search, first: 2) {
    edges {
      node {
        id
        name
        icon
      }
    }
  }
}
`;

const IngredientsAddMutation = gql`
mutation IngredientsAdd($name: String!) {
  addIngredient(name: $name, unit: "g", amount: 1) {
    user {
      id
    }
    fridgeIngredientsConnectionEdge {
      cursor
      node {
        ingredient {
          id
          name
          icon
        }
      }
    }
  }
}
`;

export interface FridgeIngredientInputProps {
  search?: string;
  onSubmit?: (ingredient: string) => any;
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

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.keyCode === 40 /* down */ && onSelect) {
      onSelect(Math.min(selectIndex + 1, suggestions.edges.length - 1))
      e.preventDefault();
    } else if (e.keyCode === 38 /* up */ && onSelect) {
      onSelect(Math.max(selectIndex - 1, -1));
      e.preventDefault();
    }
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    if (!onSubmit) {
      return;
    }
    if (selectIndex >= 0) {
      onSubmit(suggestions.edges[selectIndex].node.name);
    } else if (props.search) {
      onSubmit(props.search);
    }
  };

  return (
    <form className="FridgeIngredientInput" onSubmit={handleSubmit}>
      <input
        value={search}
        onChange={onSearch}
        onKeyDown={onKeyDown}
      />
      <ul>
        {
          suggestions.edges.map((edge, index) =>
            <li key={edge.node.id}>{selectIndex === index && <span>x</span>} {edge.node.name}</li>
          )
        }
      </ul>
    </form>
  );
}

export interface FridgeIngredientInputWithDataState {
  search: string;
  selectIndex: number;
}
export class FridgeIngredientInputWithData extends React.PureComponent<{}, FridgeIngredientInputWithDataState> {
  public state: FridgeIngredientInputWithDataState = {
    search: '',
    selectIndex: -1,
  };

  public onSearch: React.FormEventHandler<HTMLInputElement> = event => {
    this.setState({ search: event.currentTarget.value, selectIndex: -1 });
  }

  public addIngredient = (mutate: MutationFn<IngredientsAdd, IngredientsAddVariables>): (ingredient: string) => any => async ingredient => {
    const variables: IngredientsAddVariables = { name: ingredient };
    const result = await mutate({ 
      update: (proxy, response) => {
        const data = proxy.readQuery<FridgeContentViewer>( { query: FridgeContentViewerQuery } );
        if (!data || !data.viewer || !response.data || !response.data.addIngredient) {
          return;
        }
        const addIngredient = response.data.addIngredient;
        const edge = addIngredient.fridgeIngredientsConnectionEdge;
        data.viewer.fridge.ingredients.edges.push(edge);
        proxy.writeQuery({ data, query: FridgeContentViewerQuery });
      },
      variables,
    });
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
            <Mutation mutation={IngredientsAddMutation}>{
              (mutate) => {
                return (
                  <FridgeIngredientInput
                    search={search}
                    onSearch={this.onSearch}
                    onSubmit={this.addIngredient(mutate)}
                    onSelect={this.onSelect}
                    suggestions={edges}
                    selectIndex={selectIndex}
                  />
                );
              }
            }
            </Mutation>
          );
        }}
      </Query>
    );
  }
}
