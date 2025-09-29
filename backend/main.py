import gradio as gr
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer, BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import pandas as pd
import fitz  # PyMuPDF
import os
import json

# Load models
gpt_tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
gpt_model = GPT2LMHeadModel.from_pretrained("gpt2")
gpt_model.eval()

blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model.eval()


# Read file contents
def read_file(file):
    if file is None:
        return "No file uploaded."

    ext = os.path.splitext(file.name)[1].lower()

    if ext == ".txt":
        return file.read().decode("utf-8")
    elif ext == ".pdf":
        doc = fitz.open(stream=file.read(), filetype="pdf")
        return "\n".join(page.get_text() for page in doc)
    elif ext == ".csv":
        df = pd.read_csv(file)
        return df.head().to_string()
    else:
        return f"Unsupported file type: {ext}"


# Caption an image
def describe_image(image):
    image = image.convert("RGB")
    inputs = blip_processor(image, return_tensors="pt")
    with torch.no_grad():
        out = blip_model.generate(**inputs)
    caption = blip_processor.decode(out[0], skip_special_tokens=True)
    return caption


# Generate GPT-2 response
def generate_gpt_response(prompt):
    input_ids = gpt_tokenizer.encode(prompt, return_tensors="pt", truncation=True, max_length=1024)
    with torch.no_grad():
        output_ids = gpt_model.generate(
            input_ids,
            max_length=input_ids.shape[1] + 100,
            do_sample=True,
            top_k=50,
            top_p=0.95,
            temperature=0.9,
            pad_token_id=gpt_tokenizer.eos_token_id
        )
    output_text = gpt_tokenizer.decode(output_ids[0], skip_special_tokens=True)
    return output_text[len(prompt):].strip().split("\n")[0]


# Main chat function
def chat_fn(user_input, chat_history, uploaded_file=None, uploaded_image=None):
    system_message = ""

    if uploaded_file:
        content = read_file(uploaded_file)
        system_message = f"File Content:\n{content}\n"
    elif uploaded_image:
        caption = describe_image(uploaded_image)
        system_message = f"Image Description: {caption}\n"

    chat_history.append(f"You: {user_input}")
    prompt = "\n".join(chat_history + [system_message + "AI:"])
    response = generate_gpt_response(prompt)
    chat_history.append(f"AI: {response}")

    chat_text = "\n".join(chat_history[-10:])  # limit to last 10 turns
    return chat_text, chat_history


# Save chat to a file
def save_chat(history):
    with open("chat_history.json", "w", encoding="utf-8") as f:
        json.dump(history, f)
    return "✅ Chat saved to chat_history.json"


# Load chat from a file
def load_chat():
    if os.path.exists("chat_history.json"):
        with open("chat_history.json", "r", encoding="utf-8") as f:
            history = json.load(f)
        chat_text = "\n".join(history[-10:])
        return chat_text, history
    return "No saved chat found.", []


# Create the Gradio UI
with gr.Blocks() as demo:
    gr.Markdown("# 🧠 Multimodal AI Chatbot")
    chatbot_output = gr.Textbox(label="Chat History", lines=20)

    with gr.Row():
        user_input = gr.Textbox(label="Your Message", placeholder="Ask something...")
        submit_btn = gr.Button("Send")

    with gr.Row():
        uploaded_file = gr.File(label="Upload File (.txt, .pdf, .csv)")
        uploaded_image = gr.Image(label="Upload Image", type="pil")

    with gr.Row():
        save_btn = gr.Button("💾 Save Chat")
        load_btn = gr.Button("📂 Load Chat")

    state = gr.State([])

    # Actions
    submit_btn.click(chat_fn, [user_input, state, uploaded_file, uploaded_image], [chatbot_output, state])
    save_btn.click(save_chat, [state], chatbot_output)
    load_btn.click(load_chat, [], [chatbot_output, state])

# Launch the app
demo.launch()