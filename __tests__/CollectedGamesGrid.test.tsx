import '@testing-library/jest-dom';
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CollectedGamesGrid from "../src/components/CollectedGamesGrid";

const mockGames = [
  {
    id: 1,
    name: "Zelda",
    cover: { url: "//images.igdb.com/igdb/image/upload/t_thumb/sample.jpg" },
    first_release_date: 1627776000,
    collectedAt: 1627780000,
  },
  {
    id: 2,
    name: "Mario",
    cover: { url: "//images.igdb.com/igdb/image/upload/t_thumb/sample2.jpg" },
    first_release_date: 1627776000,
    collectedAt: 1627781000,
  },
];

describe("CollectedGamesGrid", () => {
  it("renders game details correctly", () => {
    render(
      <CollectedGamesGrid
        collectedGames={mockGames}
        activeFilter="Newest"
        handleGameClick={() => {}}
        handleRemoveGame={() => {}}
        loading={false}
      />
    );
    expect(screen.getByText("Zelda")).toBeInTheDocument();
    expect(screen.getByText("Mario")).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getAllByText("2021")).toHaveLength(2);
  });

  it("calls handleGameClick when card is clicked", () => {
    const handleGameClick = jest.fn();
    render(
      <CollectedGamesGrid
        collectedGames={mockGames}
        activeFilter="Newest"
        handleGameClick={handleGameClick}
        handleRemoveGame={() => {}}
        loading={false}
      />
    );
    fireEvent.click(screen.getByText("Zelda"));
    expect(handleGameClick).toHaveBeenCalledWith(1);
  });

  it("calls handleRemoveGame when delete icon is clicked", () => {
    const handleRemoveGame = jest.fn();
    render(
      <CollectedGamesGrid
        collectedGames={mockGames}
        activeFilter="Newest"
        handleGameClick={() => {}}
        handleRemoveGame={handleRemoveGame}
        loading={false}
      />
    );
    const deleteButtons = screen.getAllByLabelText("delete");
    fireEvent.click(deleteButtons[0]);
    expect(handleRemoveGame).toHaveBeenCalledWith(1, "Zelda");
  });

  it("shows skeletons when loading is true", () => {
    render(
      <CollectedGamesGrid
        collectedGames={[]}
        activeFilter="Newest"
        handleGameClick={() => {}}
        handleRemoveGame={() => {}}
        loading={true}
      />
    );
    expect(screen.getAllByRole("presentation")).toHaveLength(8);
  });
});
