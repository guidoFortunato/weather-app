import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";

const URL = `http://api.weatherapi.com/v1/current.json?key=${
  import.meta.env.VITE_API_KEY
}&q=`;

const initialError = {
  ok: false,
  message: "",
};

const initialInfo = {
  city: "",
  country: "",
  temperature: 0,
  condition: "",
  conditionText: "",
  icon: "",
};

console.log("inicia componente");

function App() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [weather, setWeather] = useState(initialInfo);

  const handleCity = (e) => {
    setCity(e.target.value);
    setError({
      ok: false,
      message: "",
    });
    setWeather(initialInfo);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!city.trim()) throw { message: "El campo ciudad es obligatorio" };
      const res = await fetch(URL + city);
      if (!res.ok) {
        throw { message: `No hay resultados para la ubicacion ${city}` };
      }

      const data = await res.json();
      console.log(data)
      setWeather({
        city: data.location.name,
        country: data.location.country,
        temperature: data.current.temp_c,
        condition: data.current.condition.code,
        conditionText: data.current.condition.text,
        icon: data.current.condition.icon,
      });
    } catch (err) {
      setError({
        ok: true,
        message: err.message,
      });
      throw new Error(err.message);
    } finally {
      setLoading(false);
      setCity("");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 2 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Weather App
      </Typography>
      <Box
        sx={{ display: "grid", gap: 2 }}
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          id="city"
          label="city"
          variant="outlined"
          size="small"
          required
          error={error.ok}
          helperText={error.message}
          value={city}
          onChange={handleCity}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          loadingIndicator="Loading..."
        >
          Search
        </LoadingButton>
      </Box>

      {weather.city && (
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gap: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" component="h2">
            {weather.city}, {weather.country}
          </Typography>
          <Box
            component="img"
            alt={weather.conditionText}
            src={weather.icon}
            sx={{ margin: "0 auto" }}
          />
          <Typography variant="h5" component="h3">
            {weather.temperature} °C
          </Typography>
          <Typography variant="h6" component="h4">
            {weather.conditionText}
          </Typography>
        </Box>
      )}

      <Typography textAlign="center" sx={{ mt: 2, fontSize: "10px" }}>
        Powered by:
        <a
          href="https://www.weatherapi.com/"
          title="Wheather API"
          target="_blank"
        >
          Wheather API
        </a>
      </Typography>
    </Container>
  );
}

export default App;
