import { Stack, CircularProgress } from "@mui/material"

const Loader = () => {
  return (
    <Stack alignItems={"center"} justifyContent={"center"} height={"85vh"}>
      <CircularProgress size={"5rem"} />
    </Stack>
  )
}

export default Loader