package GPT

import (
	"context"
	"fmt"

	openai "github.com/sashabaranov/go-openai"
)

type GPT struct {
	client *openai.Client
}

func NewGPT() *GPT {
	client := openai.NewClient("")
	gpt := &GPT{
		client: client,
	}
	return gpt
}

func (gpt *GPT) CreateChatCompletion(ctx context.Context, content string) string {
	response, err := gpt.client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: content,
				},
			},
		},
	)
	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return ""
	}
	return response.Choices[0].Message.Content
}
