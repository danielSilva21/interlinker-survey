const {
    CssBaseline,
    ThemeProvider,
    Container,
    InputLabel,
    TextField,
    Button,
    Box,
    Avatar,
    Typography
} = MaterialUI;


function App() {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [error, setError] = React.useState("");
    const [created, setCreated] = React.useState(false);
    const inIframe = window.location !== window.parent.location

    React.useEffect(() => {
        if (inIframe) {
            window.parent.postMessage({
                'code': 'initialized',
            }, "*");
        }
    }, [])
    const submit = () => {
        if(!title){
            setError("title")
            return
        }
        if(!description){
            setError("description")
            return
        }
        service.create({ title, description }).then(response => {
            console.log("RESPONSE CONFIRM", response.data);
            if (inIframe) {
                window.parent.postMessage({
                    'code': 'asset_created',
                    'data': response.data
                }, "*");
            }
            else {
                setCreated(response.data)
            }
        })
    }
    return (
        <Container maxWidth={false}>


            {created ?
                (<Box
                    sx={{
                        maxWidth: 450,
                        mx: 'auto',
                        alignItems: "center"
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Avatar
                            src=""
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography
                            align='center'
                            color='textPrimary'
                            variant='h3'
                        >
                            Asset created!
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography
                            align='center'
                            color='textSecondary'
                            variant='subtitle1'
                        >
                            The asset is now accessible for this task.
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 2,
                        }}
                    >
                        <Button
                            color='primary'
                            variant='contained'
                            href={`${basepath}/assets/${created._id}/viewer/`}
                        >
                            Open asset
                        </Button>
                    </Box>
                </Box>)
                : (
                    <React.Fragment>
                        <InputLabel>Title</InputLabel>

                        <TextField error={error === "title"} helperText={title === "" && "Required"} variant="outlined" value={title} fullWidth onChange={(e) => setTitle(e.target.value)} />
                        <InputLabel>Description</InputLabel>
                        <TextField error={error === "description"} helperText={description === "" && "Required"} variant="outlined" value={description} fullWidth onChange={(e) => setDescription(e.target.value)} />
                        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={() => submit()}>Create</Button>
                    </React.Fragment>
                )}
        </Container>
    );
}

ReactDOM.render(
    <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <App />
    </ThemeProvider>,
    document.querySelector('#root'),
);