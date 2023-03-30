package config

type ChatServer struct {
	Port string `yaml:"port"`
}

type GPT struct {
	APIKey string `yaml:"apiKey"`
}
