from flask import Flask, render_template, request, redirect, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask (__name__)
CORS(app)  # Enable CORS for all routes

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Avoids a warning

db = SQLAlchemy(app)

# Database Models
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

class Gallery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_filename = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(500), nullable=True)  # For external URLs if needed
    upload_date = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    is_featured = db.Column(db.Boolean, default=False)
    tags = db.Column(db.String(300), nullable=True)  # Comma-separated tags
    
    def __repr__(self):
        return f"Gallery('{self.title}', '{self.image_filename}', '{self.upload_date}')"

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'image_filename': self.image_filename,
            'image_url': self.image_url,
            'upload_date': self.upload_date.isoformat() if self.upload_date else None,
            'is_featured': self.is_featured,
            'tags': self.tags.split(',') if self.tags else []
        }

class Events(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    event_date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(200), nullable=True)
    image_filename = db.Column(db.String(100), nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    is_featured = db.Column(db.Boolean, default=False)
    is_past = db.Column(db.Boolean, default=False)
    created_date = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    ticket_url = db.Column(db.String(500), nullable=True)
    tags = db.Column(db.String(300), nullable=True)
    
    def __repr__(self):
        return f"Events('{self.title}', '{self.event_date}')"

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'event_date': self.event_date.isoformat() if self.event_date else None,
            'location': self.location,
            'image_filename': self.image_filename,
            'image_url': self.image_url,
            'is_featured': self.is_featured,
            'is_past': self.is_past,
            'created_date': self.created_date.isoformat() if self.created_date else None,
            'ticket_url': self.ticket_url,
            'tags': self.tags.split(',') if self.tags else []
        }

# File upload configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Gallery API Routes
@app.route("/api/gallery", methods=['GET'])
def get_gallery():
    """Get all gallery images"""
    try:
        images = Gallery.query.order_by(Gallery.upload_date.desc()).all()
        return {"gallery": [img.to_dict() for img in images]}
    except Exception as e:
        return {"error": str(e)}, 500

@app.route("/api/gallery/featured", methods=['GET'])
def get_featured_gallery():
    """Get only featured gallery images"""
    try:
        images = Gallery.query.filter_by(is_featured=True).order_by(Gallery.upload_date.desc()).all()
        return {"gallery": [img.to_dict() for img in images]}
    except Exception as e:
        return {"error": str(e)}, 500

@app.route("/api/gallery", methods=['POST'])
def add_gallery_image():
    """Add a new gallery image"""
    try:
        data = request.get_json()
        
        new_image = Gallery(
            title=data.get('title', 'Untitled'),
            description=data.get('description', ''),
            image_filename=data.get('image_filename'),
            image_url=data.get('image_url', ''),
            is_featured=data.get('is_featured', False),
            tags=data.get('tags', '')
        )
        
        db.session.add(new_image)
        db.session.commit()
        
        return {"success": True, "image": new_image.to_dict()}, 201
    except Exception as e:
        return {"error": str(e)}, 500

@app.route("/api/gallery/<int:image_id>", methods=['PUT'])
def update_gallery_image(image_id):
    """Update a gallery image"""
    try:
        image = Gallery.query.get_or_404(image_id)
        data = request.get_json()
        
        image.title = data.get('title', image.title)
        image.description = data.get('description', image.description) 
        image.image_url = data.get('image_url', image.image_url)
        image.is_featured = data.get('is_featured', image.is_featured)
        image.tags = data.get('tags', image.tags)
        
        db.session.commit()
        
        return {"success": True, "image": image.to_dict()}
    except Exception as e:
        return {"error": str(e)}, 500

@app.route("/api/gallery/<int:image_id>", methods=['DELETE'])
def delete_gallery_image(image_id):
    """Delete a gallery image"""
    try:
        image = Gallery.query.get_or_404(image_id)
        db.session.delete(image)
        db.session.commit()
        return {"success": True, "message": "Image deleted successfully"}
    except Exception as e:
        return {"error": str(e)}, 500

# Events API Routes
@app.route("/api/events", methods=['GET'])
def get_events():
    """Get all events"""
    try:
        events = Events.query.order_by(Events.event_date.desc()).all()
        return {"events": [event.to_dict() for event in events]}
    except Exception as e:
        return {"error": str(e)}, 500

@app.route("/api/events/upcoming", methods=['GET'])
def get_upcoming_events():
    """Get only upcoming events"""
    try:
        current_date = datetime.now()
        events = Events.query.filter(Events.event_date >= current_date).order_by(Events.event_date.asc()).all()
        return {"events": [event.to_dict() for event in events]}
    except Exception as e:
        return {"error": str(e)}, 500

@app.route("/api/events", methods=['POST'])
def add_event():
    """Add a new event"""
    try:
        # Handle file upload if present
        image_filename = ''
        if 'image_file' in request.files:
            file = request.files['image_file']
            if file and file.filename != '' and allowed_file(file.filename):
                # Secure the filename and add timestamp to avoid conflicts
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_")
                filename = secure_filename(file.filename)
                filename = timestamp + filename
                
                # Save the file
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                image_filename = filename
        
        # Get form data
        title = request.form.get('title')
        description = request.form.get('description')
        event_date = request.form.get('event_date')
        location = request.form.get('location', '')
        is_featured = request.form.get('is_featured') == 'true'
        ticket_url = request.form.get('ticket_url', '')
        tags = request.form.get('tags', '')
        
        new_event = Events(
            title=title,
            description=description,
            event_date=datetime.fromisoformat(event_date),
            location=location,
            image_filename=image_filename,
            image_url='',  # No longer using image_url, using file uploads instead
            is_featured=is_featured,
            ticket_url=ticket_url,
            tags=tags
        )
        
        db.session.add(new_event)
        db.session.commit()
        
        return {"success": True, "event": new_event.to_dict()}, 201
    except Exception as e:
        return {"error": str(e)}, 500

@app.route("/api/events/<int:event_id>", methods=['PUT'])
def update_event(event_id):
    """Update an existing event"""
    try:
        event = Events.query.get_or_404(event_id)
        data = request.get_json()
        
        event.title = data.get('title', event.title)
        event.description = data.get('description', event.description)
        if data.get('event_date'):
            event.event_date = datetime.fromisoformat(data.get('event_date'))
        event.location = data.get('location', event.location)
        event.image_filename = data.get('image_filename', event.image_filename)
        event.image_url = data.get('image_url', event.image_url)
        event.is_featured = data.get('is_featured', event.is_featured)
        event.ticket_url = data.get('ticket_url', event.ticket_url)
        event.tags = data.get('tags', event.tags)
        
        db.session.commit()
        
        return {"success": True, "event": event.to_dict()}
    except Exception as e:
        return {"error": str(e)}, 500

@app.route("/api/events/<int:event_id>", methods=['DELETE'])
def delete_event(event_id):
    """Delete an event"""
    try:
        event = Events.query.get_or_404(event_id)
        db.session.delete(event)
        db.session.commit()
        return {"success": True, "message": "Event deleted successfully"}
    except Exception as e:
        return {"error": str(e)}, 500

# Admin Routes
@app.route("/admin")
def admin_dashboard():
    """Admin dashboard"""
    return render_template('admin.html')

@app.route("/admin/upload", methods=['POST'])
def admin_upload_image():
    """Admin route to upload images to gallery"""
    try:
        if 'file' not in request.files:
            return {"error": "No file provided"}, 400
        
        file = request.files['file']
        if file.filename == '':
            return {"error": "No file selected"}, 400
        
        if file and allowed_file(file.filename):
            # Secure the filename and add timestamp to avoid conflicts
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_")
            filename = secure_filename(file.filename)
            filename = timestamp + filename
            
            # Save the file
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            # Create gallery entry
            title = request.form.get('title', 'Untitled')
            description = request.form.get('description', '')
            is_featured = request.form.get('is_featured') == 'true'
            tags = request.form.get('tags', '')
            
            new_image = Gallery(
                title=title,
                description=description,
                image_filename=filename,
                is_featured=is_featured,
                tags=tags
            )
            
            db.session.add(new_image)
            db.session.commit()
            
            return {"success": True, "image": new_image.to_dict()}, 201
        else:
            return {"error": "Invalid file type"}, 400
            
    except Exception as e:
        return {"error": str(e)}, 500

@app.route("/admin/gallery")
def admin_gallery():
    """Admin gallery management"""
    try:
        images = Gallery.query.order_by(Gallery.upload_date.desc()).all()
        return {"gallery": [img.to_dict() for img in images]}
    except Exception as e:
        return {"error": str(e)}, 500

@app.route("/admin/events")
def admin_events():
    """Admin events management"""
    try:
        events = Events.query.order_by(Events.event_date.desc()).all()
        return {"events": [event.to_dict() for event in events]}
    except Exception as e:
        return {"error": str(e)}, 500

# Serve uploaded files
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded files"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create database tables for our data models
    # Bind to all interfaces (0.0.0.0) so other computers can access it
    # Change port if needed (default 5000)
    app.run(host='0.0.0.0', port=5000, debug=True)