function Score(props) {
    let game = props.game;
    console.log("Game", game)
    
    return (    
        <p>{game.name}, {game.score}</p>
    )
}

export default Score;