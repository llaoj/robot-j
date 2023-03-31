package config

type ChatServer struct {
	Addr     string `yaml:"addr"`
	CertFile string `yaml:"certFile"`
	KeyFile  string `yaml:"keyFile"`
}

type GPT struct {
	APIKey string `yaml:"apiKey"`
}
