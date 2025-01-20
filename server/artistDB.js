import sqlite3 from 'sqlite3';

// Initialize database connection
const db = new sqlite3.Database('db/artists.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to artists database successfully');
});

// Function to run SQL queries as promises
function run(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

// Mock data for artists
const artistsData = [
    {
        name: "Queen",
        bio: "Queen is a legendary British rock band formed in London in 1970. Known for their theatrical, bombastic style and elaborate live shows, they became one of the world's most successful rock groups. Their innovative approach to songwriting and production created a unique sound that blended rock with opera, vaudeville, and other genres.",
        funFact: "Freddie Mercury designed the famous Queen crest logo using the zodiac signs of all band members: two lions for Leo (John and Roger), a crab for Cancer (Brian), and two fairies for Virgo (Freddie).",
        popularSongs: [
            "Bohemian Rhapsody",
            "We Will Rock You",
            "Don't Stop Me Now",
            "Another One Bites the Dust",
            "We Are the Champions"
        ],
        genre: "Rock",
    },
    {
        name: "Michael Jackson",
        bio: "Michael Jackson, the 'King of Pop,' revolutionized popular music with his innovative dance moves, distinctive vocal style, and groundbreaking music videos. His album 'Thriller' remains the best-selling album of all time, showcasing his unique ability to blend pop, rock, and R&B.",
        funFact: "The iconic 'Moonwalk' dance move that Michael Jackson popularized was actually inspired by dancers he saw on the streets of Chicago, though he perfected and made it his own.",
        popularSongs: [
            "Billie Jean",
            "Thriller",
            "Beat It",
            "Man in the Mirror",
            "Smooth Criminal"
        ],
        genre: "Pop",
    },
    {
        name: "Miles Davis",
        bio: "Miles Davis was one of the most influential jazz musicians of the 20th century. His innovative approach to jazz helped develop several new styles, including cool jazz, hard bop, and jazz fusion. His album 'Kind of Blue' is the best-selling jazz album of all time.",
        funFact: "Miles Davis studied at Juilliard but dropped out to play with Charlie Parker, learning more from performing in clubs than in the classroom.",
        popularSongs: [
            "So What",
            "Blue in Green",
            "All Blues",
            "Round Midnight",
            "Seven Steps to Heaven"
        ],
        genre: "Jazz",
    },
    {
        name: "Bob Marley",
        bio: "Bob Marley was a Jamaican singer, songwriter, and musician who became an international cultural icon. He helped popularize reggae music worldwide and became a symbol of Jamaican culture and identity. His music often addressed social issues and promoted peace and unity.",
        funFact: "Before his music career, Bob Marley worked as a lab assistant for DuPont and as a welder in Delaware, USA.",
        popularSongs: [
            "No Woman, No Cry",
            "Buffalo Soldier",
            "One Love",
            "Redemption Song",
            "Is This Love"
        ],
        genre: "Reggae",
    },
    {
        name: "Ludwig van Beethoven",
        bio: "Ludwig van Beethoven was a German composer and pianist who remains one of the most admired figures in classical music. He was a crucial figure in the transition between the Classical and Romantic eras in music and is considered to be one of the greatest composers of all time.",
        funFact: "Beethoven continued to conduct and premiere new compositions even after becoming completely deaf, often sawing the legs off his pianos so he could feel the vibrations through the floor.",
        popularSongs: [
            "Symphony No. 5",
            "Für Elise",
            "Moonlight Sonata",
            "Symphony No. 9 (Ode to Joy)",
            "Piano Concerto No. 5"
        ],
        genre: "Classical",
    }
];

async function setupDatabase() {
    try {
        // Create artists table if it doesn't exist
        await run(`
            CREATE TABLE IF NOT EXISTS artists (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                bio TEXT NOT NULL,
                funFact TEXT NOT NULL,
                genre TEXT NOT NULL,
                popularSongs TEXT NOT NULL
            )
        `);


        // Insert mock data
        for (const artist of artistsData) {
            await run(
                `INSERT INTO artists (name, bio, funFact, genre, popularSongs) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    artist.name,
                    artist.bio,
                    artist.funFact,
                    artist.genre,
                    JSON.stringify(artist.popularSongs)
                ]
            );
            console.log(`Added artist: ${artist.name}`);
        }

        console.log('Artists database setup completed successfully');
    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        db.close();
    }
}

// Run the setup
async function init() {
    await setupDatabase();
}

init();