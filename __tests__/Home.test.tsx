
import '@testing-library/jest-dom';

import { render, screen, fireEvent } from '@testing-library/react';
import HomeClient from '../src/components/HomeClient';
import { useGameStore } from '../src/store/gameStore';

jest.mock('../src/store/gameStore', () => ({
  useGameStore: jest.fn(),
}));

const mockGames = [
  {
    id: 1,
    name: 'Test Game',
    cover: { url: '//images.igdb.com/igdb/image/upload/t_thumb/test.jpg' },
    first_release_date: 1688169600,
  },
];

describe('HomeClient', () => {
  const mockedUseGameStore = useGameStore as unknown as jest.Mock;

  beforeEach(() => {
    mockedUseGameStore.mockImplementation(() => ({
      getGamesByFilter: () => mockGames,
      removeGame: jest.fn(),
    }));
  });

  it('renders saved games', () => {
    render(<HomeClient />);
    expect(screen.getByText('Saved games')).toBeInTheDocument();
    expect(screen.getByText('Test Game')).toBeInTheDocument();
  });

  it('shows empty state when no games', () => {
    mockedUseGameStore.mockImplementation(() => ({
      getGamesByFilter: () => [],
      removeGame: jest.fn(),
    }));
    render(<HomeClient />);
    expect(screen.getByText('Nothing collected yet')).toBeInTheDocument();
  });

  it('removes a game when delete is clicked', () => {
    const removeGame = jest.fn();
    mockedUseGameStore.mockImplementation(() => ({
      getGamesByFilter: () => mockGames,
      removeGame,
    }));
    render(<HomeClient />);
    fireEvent.click(screen.getByRole('button', { name: 'delete' }));
    expect(removeGame).toHaveBeenCalledWith(1);
  });
});
