import { enableFetchMocks } from 'jest-fetch-mock'
import React from 'react'
import App from '../App'
import fetch from 'jest-fetch-mock';
import { render, cleanup, fireEvent, waitFor, waitForDomChange } from '@testing-library/react';

enableFetchMocks()

beforeEach(function() {
  const movie = {page: 1,
    results: [
      {id: 1,
       title: 'Movie title',
       posterPath: 'Path'}
    ]
  }
  fetch.resetMocks()
  fetch.mockResponse(JSON.stringify(movie))
});

afterEach(cleanup);

describe('user interaction tests', () => {

  it('Search field expands after search button click', async () => {
    const { getByTestId } = render(<App />);
    fireEvent.click(getByTestId('search-button'))
    const searchInput = await waitFor(() => getByTestId('search-input'))
    expect(searchInput).toHaveProperty('className','search-container-input-expand')
  });

  it('Cross icon is displayed after search button click', async () => {
    const { getByTestId } = render(<App />);
    fireEvent.click(getByTestId('search-button'))
    const crossButton = await waitFor(() => getByTestId('cross-button'))
    expect(crossButton).toHaveProperty('className','cross-container-icon-expand')
  });

  it('Dropdown menu is displayed after click on menu button', async () => {
    const { getByTestId } = render(<App />);
    fireEvent.click(getByTestId('menu-button'))
    const dropDownMenu = await waitFor(() => getByTestId('dropdown-menu'))
    expect(dropDownMenu).toHaveProperty('className','dropdown-menu-visible')
  });

  it('Search field shrinks after cross button click', async () => {
    const { getByTestId } = render(<App />);
    fireEvent.click(getByTestId('search-button'))
    const crossButton = await waitFor(() => getByTestId('cross-button'))
    fireEvent.click(crossButton)
    const searchInput = await waitFor(() => getByTestId('search-input'))
    expect(searchInput).toHaveProperty('className','search-container-input')
  });

  it('Cross button is hidden after cross button click', async () => {
    const { getByTestId } = render(<App />);
    fireEvent.click(getByTestId('search-button'))
    const crossButton = await waitFor(() => getByTestId('cross-button'))
    fireEvent.click(crossButton)
    const crossButtonHidden = await waitFor(() => getByTestId('cross-button'))
    expect(crossButtonHidden).toHaveProperty('className','cross-container-icon')
  });

  it('Dropdown menu is hidden after click on menu button', async () => {
    const { getByTestId } = render(<App />);
    fireEvent.click(getByTestId('menu-button'))
    fireEvent.click(getByTestId('menu-button'))
    const dropDownMenu = await waitFor(() => getByTestId('dropdown-menu'))
    expect(dropDownMenu).toHaveProperty('className','dropdown-menu-hidden')
  });

});

describe('Movie rendering tests', () => {

  it('Movie is rendered on page load', async () => {
    const { getByTestId } = render(<App />);
    const movieTitle = await waitFor(() => getByTestId('movie-title'))
    expect(movieTitle.innerHTML).toEqual('Movie title')
  });

  it('Movie is rendered after click on Top rated', async () => {
    const { getByTestId } = render(<App />);
    const movie = {page: 1,
      results: [
        {id: 1,
         title: 'Top rated movie',
         posterPath: 'Path'}
      ]
    }
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(movie))
    fireEvent.click(getByTestId('menu-button'))
    const topRatedLink = await waitFor(() => getByTestId('top-rated-link'))
    fireEvent.click(topRatedLink)
    const movieTitle = await waitFor(() => getByTestId('movie-title'))
    expect(movieTitle.innerHTML).toEqual('Top rated movie')
  });

  it('Movie is rendered after click on Favorites', async () => {
    const { getByTestId } = render(<App />);
    const movie = {page: 1,
      results: [
        {id: 1,
         title: 'Favorite movie',
         posterPath: 'Path'}
      ]
    }
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(movie))
    fireEvent.click(getByTestId('menu-button'))
    const favoritesLink = await waitFor(() => getByTestId('favorites-link'))
    fireEvent.click(favoritesLink)
    const movieTitle = await waitFor(() => getByTestId('movie-title'))
    expect(movieTitle.innerHTML).toEqual('Favorite movie')
  });

  it('Movie is rendered after click on Watch later', async () => {
    const { getByTestId } = render(<App />);
    const movie = {page: 1,
      results: [
        {id: 1,
         title: 'Watch later movie',
         posterPath: 'Path'}
      ]
    }
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(movie))
    fireEvent.click(getByTestId('menu-button'))
    const watchListLink = await waitFor(() => getByTestId('watchlist-link'))
    fireEvent.click(watchListLink)
    const movieTitle = await waitFor(() => getByTestId('movie-title'))
    expect(movieTitle.innerHTML).toEqual('Watch later movie')
  });

  it('Movie is rendered after typing in search field', async () => {
    const event = {}
    event.target = {}
    event.target.value = 'A'
    const { getByTestId } = render(<App />);
    const movie = {page: 1,
      results: [
        {id: 1,
         title: 'Found movie',
         posterPath: 'Path'}
      ]
    }
    fetch.resetMocks()
    fetch.mockResponse(JSON.stringify(movie))
    fireEvent.click(getByTestId('search-button'))
    const searchInput = await waitFor(() => getByTestId('search-input'))
    fireEvent.keyPress(searchInput, { key: 'A', code: 'KeyA' })
    const container = getByTestId('movie-title')
    waitFor({ container })
      .then(() => expect(container.innerHTML).toEqual('Found movie'))
      .catch(err => console.log(err))
  });
});

describe('Main title tests', () => {

  it('Main title is rendered on page load', async () => {
    const { getByTestId } = render(<App />);
    const title = await waitFor(() => getByTestId('main-title'))
    expect(title.innerHTML).toEqual('Top Rated Movies')
  });

  it('Main title is rendered after click on Top rated', async () => {
    const { getByTestId } = render(<App />);
    fireEvent.click(getByTestId('menu-button'))
    const topRatedLink = await waitFor(() => getByTestId('top-rated-link'))
    fireEvent.click(topRatedLink)
    const title = await waitFor(() => getByTestId('main-title'))
    expect(title.innerHTML).toEqual('Top Rated Movies')
  });

  it('Main title is rendered after click on Favorites', async () => {
    const { getByTestId } = render(<App />);
    fireEvent.click(getByTestId('menu-button'))
    const favoritesLink = await waitFor(() => getByTestId('favorites-link'))
    fireEvent.click(favoritesLink)
    const title = await waitFor(() => getByTestId('main-title'))
    expect(title.innerHTML).toEqual('Favorite Movies')
  });

  it('Main title is rendered after click on Watch later', async () => {
    const { getByTestId } = render(<App />);
    fireEvent.click(getByTestId('menu-button'))
    const watchListLink = await waitFor(() => getByTestId('watchlist-link'))
    fireEvent.click(watchListLink)
    const title = await waitFor(() => getByTestId('main-title'))
    expect(title.innerHTML).toEqual('Watch Later')
  });

  it('Main title is rendered after typing in search field', async () => {
    const event = {}
    event.target = {}
    event.target.value = 'A'
    const { getByTestId } = render(<App />);
    fireEvent.click(getByTestId('search-button'))
    const searchInput = await waitFor(() => getByTestId('search-input'))
    fireEvent.keyPress(searchInput, { key: 'A', code: 'KeyA' })
    const container = getByTestId('main-title')
    waitFor({ container })
      .then(() => expect(container.innerHTML).toEqual('Search Result'))
      .catch(err => console.log(err))
  });

});
