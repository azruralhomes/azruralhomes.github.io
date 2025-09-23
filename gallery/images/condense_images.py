from PIL import Image
import os


def optImages():
    for filename in os.listdir('.'):
        # Skip directories
        if os.path.isdir(filename) or ('jpg' not in filename and 'JPG' not in filename or 'small_' in filename):
            continue

        foo = Image.open(filename)  # My image is a 200x374 jpeg that is 102kb large
        print(filename, foo.size)  # (200, 374)
        w = int(foo.size[0] / 10)
        h = int(foo.size[1] / 10)
        
        # downsize the image with an ANTIALIAS filter (gives the highest quality)
        foo = foo.resize((w,h), Image.Resampling.LANCZOS)
        
        foo.save('small_' + filename, optimize=True, quality=95)  # The saved downsized image size is 22.9kb


if __name__ =="__main__":
    optImages()