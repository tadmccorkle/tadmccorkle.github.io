"""This file paginates the blog posts for this site.

This file contains a script that creates the directory structure needed for
custom jekyll pagination without a plugin.
- Execute via 'python paginate.py [-h/--help] [-d/--drafts]'
- Do not import as module
- Arguments:
    - [-h] or [--help]:     show help and exit
    - [-d] or [--drafts]:   include drafts in pagination structure
"""

import argparse
import math
import os
import re
import shutil


def get_files(dir):
    """Get the files in the specified directory and its subdirectories.

    Parameters:
        dir (str): The directory to search

    Returns:
        list: A list of the files in the specified directory

    """
    files = list()
    with os.scandir(dir) as entries:
        for entry in entries:
            if entry.is_dir():
                files.extend(get_files(f'{dir}{entry.name}/'))
            else:
                files.append(entry.path)
    return files


def delete_subdirs(dir):
    """Delete the subdirectories of the specified directory.

    Parameters:
        dir (str): The directory to search

    NOTE: Does not delete files within the specified directory.

    """
    with os.scandir(dir) as entries:
        for entry in entries:
            if entry.is_dir():
                shutil.rmtree(f'{dir}{entry.name}/')


def get_category(post):
    """Get the post category from the front matter of the specified post.

    Parameters:
        post (str): The file path of the post

    Returns:
        str: The category name of the post

    """
    # get the front matter of the post
    front_matter = list()
    with open(post) as f:
        for line in f:
            if '---' in line and '---' in front_matter:
                break
            front_matter.append(line.strip())
    front_matter = front_matter[1:]

    # get the post category from the front matter
    category = 'Other'
    for item in front_matter:
        if 'category' in item.lower():
            category = item.split('category: ')[1]
    return category


def add_front_matter_file(dir, title, page_num):
    """Add a file with front matter needed for pagination.

    Parameters:
        dir (str)       : The directory that needs the file added
        title (str)     : The title of the page
        page_num (int)  : the pagination number

    NOTE: 'dir' is created in this function. Only its parent
        directory should exist

    """
    os.mkdir(dir)
    with open(f'{dir}index.md', 'w') as f:
        f.writelines('\n'.join([
            '---',
            f'title: {title}',
            f'page_num: {page_num}',
            '---'
        ]))


def paginate_category(category, num_pages):
    """Create pagination directory structure for categories.

    Parameters:
        category (str)  : The category as it appears in the site
        num_pages (int) : The number of pages needed to paginate the posts in
            the category

    """
    category_dir = f'_category/{"-".join(category.lower().split())}/'
    if os.path.exists(category_dir):
        shutil.rmtree(category_dir)
    add_front_matter_file(category_dir, category, 1)
    if num_pages > 1:
        category_pages_dir = f'{category_dir}page/'
        os.mkdir(category_pages_dir)
        for page_num in range(2, num_pages + 1):
            category_page_dir = f'{category_pages_dir}{page_num}/'
            add_front_matter_file(category_page_dir, category, page_num)


def main():
    """Pagination script."""
    # set up command line/terminal arguments
    parser = argparse.ArgumentParser(
        description='A script that creates the directory structure needed for '
                    'tadmccorkle.com\'s custom pagination.')
    parser.add_argument('-d', '--drafts',
                        action='store_true',
                        help='include drafts in pagination structure')

    # get config.yml information
    with open('_config.yml') as f:
        config = f.read()
        np_match = re.search(r'num_pagination\s+: \d+', config)
        num_pagination = int(np_match.group(0).split(': ')[1])
        bt_match = re.search(r'blog_title.*\n', config)
        blog_title = bt_match.group(0).split('"')[1]

    # get posts to paginate
    posts = get_files('_posts/')
    if parser.parse_args().drafts:
        posts.extend(get_files('_drafts/'))

    # get categories of each post
    categories = dict()
    for post in posts:
        category = get_category(post)
        categories[category] = categories.get(category, 0) + 1

    # paginate all blog posts
    num_pages = math.ceil(len(posts) / num_pagination)
    blog_pages_dir = 'blog/page/'
    if os.path.exists(blog_pages_dir):
        shutil.rmtree(blog_pages_dir)
    if num_pages > 1:
        os.mkdir(blog_pages_dir)
        for page_num in range(2, num_pages + 1):
            blog_page_dir = f'{blog_pages_dir}{page_num}/'
            add_front_matter_file(blog_page_dir, blog_title, page_num)

    # paginate posts by category
    delete_subdirs('_category/')
    for category, num_posts in categories.items():
        num_pages = math.ceil(num_posts / num_pagination)
        paginate_category(category, num_pages)


if __name__ == '__main__':
    main()
