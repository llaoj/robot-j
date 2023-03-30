package config

import (
	"flag"
	"log"
	"os"

	"gopkg.in/yaml.v2"
)

type Config struct {
	ChatServer ChatServer `yaml:"chatServer"`
	GPT        GPT        `yaml:"gpt"`
}

func NewConfig() *Config {
	path := flag.String("config", "/etc/robot-j/config.yaml", "the absolute path of config.yaml")
	flag.Parse()

	content, err := os.ReadFile(*path)
	if err != nil {
		log.Fatalf("error: %v", err)
	}
	var config Config
	err = yaml.Unmarshal(content, &config)
	if err != nil {
		log.Fatalf("error: %v", err)
	}
	return &config
}
